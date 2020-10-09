import Vue from 'vue';
import Loader from './Loader';
import { Bar, mixins } from 'vue-chartjs';
import { Chart } from 'chart.js';
import DualFilterUtil from './mixins';

var template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <h5>{{header}} de {{title}}</h5>
            <Loader v-if="!loaded"/>
            <category-years-chart v-if="loaded" :chart-data="chartData"></category-years-chart>
        </div>
    </div>
</div>`;

const CategoryYearsChart = Vue.extend({
    extends: Bar,
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
                                let fmt = Intl.NumberFormat().format;
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
                            display: false, labelString: "Tipo"
                        }
                    }]
                },
                legend: {
                    display: false
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
                        color: "white",
                        display: true,
                        rotation: -90,
                        clamp: true,
                        anchor: 'start',
                        align: 'end',
                        formatter: (value: any, context: any) => Intl.NumberFormat().format(value)
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

const CategoryYears = Vue.extend({
    name: "CategoryYears",
    components: {
        CategoryYearsChart, Loader
    },
    mixins: [DualFilterUtil],
    template,
    data() {
        return {
            loaded: false,
            title: "",
            colors: [],
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
        updateChart(filters: object = {}) {
            this.loaded = false;
            let categories: Map<string, string> = this.$store.getters.getMCategories;
            let rawData: number[][] = [
                    this.$store.getters.getMDataY1,
                    this.$store.getters.getMDataY2
            ];
            let lastDate = rawData[1][rawData[1].length - 1]["fecha"];
            let lastYear = parseInt(lastDate.split("-")[0]);
            let volumes: number[] = [];
            this.title = categories.get(this.type);
            let labels = [lastYear - 1, lastYear]

            if (!this.isEmpty(filters)) {
                rawData[0] = this.filterMonthData(filters, rawData[0]);
                rawData[1] = this.filterMonthData(filters, rawData[1]);
            }
            
            labels.forEach((value, idx) => {
                let vol = rawData[idx].filter(item => item["categoria"] === this.type)
                                        .reduce((sum, item) => sum + item["volumen"], 0);
                volumes.push(vol);
            });
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: object, volumes: number[]) {
            this.chartData = {
                labels: labels,
                datasets: [{
                    backgroundColor: (this.title == "GASOIL" ? this.colors[0] : this.colors[1]),
                    data: volumes,
                }]
            };
        }
    },
    mounted() {
        const schm: any = Chart["colorschemes"];
        this.colors = [schm.office.Blue6, 
                       schm.office.Orange6.slice(0, 2).reverse()];
        this.filters["fComp"] = false;
        this.requestData();
    }
});

export default CategoryYears;