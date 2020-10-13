import Vue from 'vue';
import Loader from './Loader';
import { Line, mixins } from 'vue-chartjs';
import { DualFilterUtil, FilterObj, Record } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <h5>{{header}} de {{title}}</h5>
            <Loader v-if="!loaded"/>
            <category-months-chart v-if="loaded" :chart-data="chartData"></category-months-chart>
        </div>
    </div>
</div>`;

interface Labels {
    [propName: string]: any
}

const CategoryMonthsChart = Vue.extend({
    extends: Line,
    mixins: [ mixins.reactiveProp ],
    props: {
        chartData: {
            type: Object,
            required: false
        },
        title: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: (label: number) => {
                                const fmt = Intl.NumberFormat().format;
                                if (label < 1e3) return fmt(label);
                                if (label >= 1e6) return fmt(label / 1e6) + "M";
                                if (label >= 1e3) return fmt(label / 1e3) + "K";
                            }
                        },
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Litros"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            display: true
                        },
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false, labelString: "Mes"
                        }
                    }]
                },
                legend: {
                    display: true
                },
                title: {
                    display: this.title !== undefined,
                    text: this.title
                },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => Intl.NumberFormat().format(data.datasets[item.datasetIndex].data[item.index])
                    }
                },
                plugins: {
                    datalabels: {
                        display: true,
                        labels: {
                            value: {
                                font: {weight: 'bold'},
                            }
                        },
                        align: 'end',
                        formatter:  (label: number) => {
                            const fmt = Intl.NumberFormat('es-PY', {maximumFractionDigits: 2}).format;
                            return fmt(label / 1e6);
                        }
                    },
                    colorschemes: {
                        scheme: this.chartData.colors,
                        custom: (scheme: string[]) => {
                            return this.chartData.colors.match("Blue") ? scheme : [scheme[1], scheme[0]];
                        }
                    }
                },
                maintainAspectRatio: false
            }
        }
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

const CategoryMonths = Vue.extend({
    name: "CategoryMonths",
    components: {
        CategoryMonthsChart, Loader
    },
    mixins: [DualFilterUtil],
    template,
    data() {
        return {
            loaded: false,
            title: "",
            chartData: {}
        }
    },
    props: {
        header: String,
        type: String,
        xclass: String,
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByMonth").then(this.updateChart);
        },
        updateChart(filters: FilterObj = {fComp: undefined, fMonth: undefined}) {
            this.loaded = false;
            const categories: Map<string, string> = this.$store.getters.getMCategories;
            const rawData: Record[][] = [
                    this.$store.getters.getMDataY1,
                    this.$store.getters.getMDataY2
            ];

            const lastDate = rawData[1][rawData[1].length - 1].fecha;
            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const lastMonth = parseInt(lastDate.split("-")[1], 10);
            const months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);
            const years = [lastYear - 1, lastYear];
            const volumes: object[] = [];
            this.title = categories.get(this.type);
            const labels: Labels = {
                "months": months.map((item) => this.MONTHS[item - 1]),
                "years": years
            };
            const fMonth = filters.fMonth;
            if (fMonth !== undefined) {
                labels.months = labels.months.filter((item: string) => fMonth.indexOf(item) >= 0);
            }

            years.forEach((value, idx) => {
                const vols: number[] = [];
                months.forEach((month) => {
                    const thisMonth = this.MONTHS[month - 1];
                    if (fMonth !== undefined && fMonth.indexOf(thisMonth) < 0) {
                        return;
                    }
                    let fmt: string = `${value}-0${month}-01`;
                    if (month > 10) {
                        fmt = `${value}-${month}-01`;
                    }
                    const vol =  rawData[idx].filter(item => item.categoria === this.type && item.fecha === fmt)
                                           .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);

                });

                volumes.push(vols);
            })
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: object[]) {
            this.chartData = {
                colors: this.title === "GASOIL" ? 'office.Blue6' : 'office.Orange6',
                labels: labels.months,
                datasets: [{
                    label: labels.years[0],
                    data: volumes[0],
                    lineTension: 0,
                    fill: false
                },
                {
                    label: labels.years[1],
                    data: volumes[1],
                    lineTension: 0,
                    fill: false
                }]
            };
        }
    },
    mounted() {
        this.filters.fComp = false;
        this.requestData();
    }
});

export default CategoryMonths;