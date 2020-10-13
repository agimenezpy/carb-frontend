import Vue from 'vue';
import { Line, mixins } from 'vue-chartjs';
import { DualFilterUtil, FilterObj, Record } from './mixins';
import Loader from './Loader';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <h5>{{header}} de {{title}}</h5>
            <Loader v-if="!loaded"/>
            <category-time-chart v-if="loaded" :chart-data="chartData" :title="subtitle"></category-time-chart>
        </div>
    </div>
</div>`;

interface Labels {
    [propName: string]: string[]
}

const CategoryTimeChart = Vue.extend({
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
                        formatter: (value: any, context: any) => Intl.NumberFormat().format(value)
                    },
                    colorschemes: {
                        scheme: 'office.Office6'
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

const CategoryTime = Vue.extend({
    name: "CategoryTime",
    components: {
        CategoryTimeChart, Loader
    },
    mixins: [DualFilterUtil],
    template,
    data() {
        return {
            loaded: false,
            chartData: {},
            title: "",
            subtitle: ""
        }
    },
    props: {
        header: String,
        xclass: String,
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByCategory").then(this.updateChart);
        },
        updateChart(filters: FilterObj = {fComp: undefined, fMonth: undefined}) {
            this.loaded = false;
            const categories: Map<string, string> = this.$store.getters.getCategories;
            let rawData: Record[] = this.$store.getters.getCatData;
            const lastDate = rawData[rawData.length - 1].fecha;
            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const lastMonth = parseInt(lastDate.split("-")[1], 10);

            const labels: Labels = {
                "months": [],
                "categories": Array.from(categories).map(item => (item[1]))
            };
            const volumes: object[] = [];
            const fMonth = filters.fMonth;

            if (!this.isEmpty(filters)) {
                rawData = this.filterCompData(filters, rawData);
            }

            let maxMonth = 0;
            const months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);
            categories.forEach((value, key) => {
                const vols: number[] = [];
                months.forEach((month) => {
                    const thisMonth = this.MONTHS[month - 1];
                    if (fMonth !== undefined && fMonth.indexOf(thisMonth) < 0) {
                        return;
                    }
                    let fmt: string = `${lastYear}-0${month}-01`;
                    if (month > 10) {
                        fmt = `${lastYear}-${month}-01`;
                    }
                    const vol =  rawData.filter(item => item.categoria === key && item.fecha === fmt)
                                      .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);
                    if (labels.months.length < months.length && month > maxMonth) {
                        labels.months.push(thisMonth);
                        maxMonth = month;
                    }
                });

                volumes.push(vols);
            })
            this.setChartData(`Año ${lastYear}`, labels, volumes);
            this.loaded = true;
        },
        setChartData(title: string, labels: Labels, volumes: object[]) {
            this.subtitle = title;
            this.title = labels.categories.join(" y ");
            this.chartData = {
                labels: labels.months,
                datasets: [{
                    label: labels.categories[0],
                    data: volumes[0],
                    lineTension: 0,
                    fill: false
                },
                {
                    label: labels.categories[1],
                    data: volumes[1],
                    lineTension: 0,
                    fill: false
                }]
            }
        }
    },
    mounted() {
        this.requestData();
    }
});

export default CategoryTime;