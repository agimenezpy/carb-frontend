import Vue from 'vue';
import { Doughnut, mixins } from 'vue-chartjs';
import Loader from './Loader';
import DualFilterUtil from './mixins';
import { Chart } from 'chart.js';

var template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <h5>{{header}} de {{title}}</h5>
            <Loader v-if="!loaded"/>
            <category-chart v-if="loaded" :chart-data="chartData"></category-chart>
        </div>
    </div>
</div>`;

const CategoryChart = Vue.extend({
    extends: Doughnut,
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
                rotation: (!this.chartData.invert ? 1 : -1)*0.5 * Math.PI,
                plugins: {
                    datalabels: {
                        display: (context: any) => {
                            return !this.chartData.invert && context.dataIndex == 0 ||
                                    this.chartData.invert && context.dataIndex == 1; 
                        },
                        formatter: (value: any, context: any) => {
                            let dataset = context.chart.data.datasets[0];
                            var total = dataset.data.reduce((previousValue: number, currentValue: number) => previousValue + currentValue);
                            var currentValue = dataset.data[context.dataIndex];
                            var percentage = Math.floor(((currentValue/total) * 100)+0.5);         
                            return percentage + "%";
                        },
                        color: 'white',
                        labels: {
                            value: {
                                font: {
                                    weight: 'bold',
                                    size: '16'
                                }
                            }
                        }
                    },
                    colorschemes: {
                        scheme: this.chartData.colors
                    }
                },
                maintainAspectRatio: true
            }
        }
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

const Category = Vue.extend({
    name: "Category",
    components: {
        CategoryChart, Loader
    },
    mixins: [DualFilterUtil],
    template,
    data() {
        return {
            loaded: false,
            chartData: {},
            colors: [],
            title: ""
        }
    },
    props: {
        header: String,
        type: String,
        xclass: String,
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByCategory").then(this.updateChart);
        },
        updateChart(filters: object = {}) {
            this.loaded = false;
            let categories: Map<string, string> = this.$store.getters.getCategories;
            let rawData: object[] = this.$store.getters.getCatData;

            let labels: string[] = [];
            let volumes: number[] = [];

            if (!this.isEmpty(filters)) {
                rawData = this.filterDualData(filters, rawData);
            }

            categories.forEach((value, key) => {
                let vol = rawData.filter(item => item["categoria"] === key)
                                 .reduce((sum, item) => sum + item["volumen"], 0);
                if (vol > 0) {
                    labels.push(value);
                    volumes.push(vol)
                }
            })
            this.title = categories.get(this.type);
            this.loaded = true;
            this.setChartData(labels, volumes);
        },
        setChartData(labels: string[], volumes: number[]) {
            this.chartData = {
                colors: this.title == "GASOIL" ? this.colors[0]: this.colors[1],
                invert: this.title !== "GASOIL",
                labels: labels,
                datasets: [
                    {
                        data: volumes
                    }
                ]
            }
        }
    },
    mounted() {
        const schemes: any = Chart["colorschemes"];
        this.colors = [[schemes.office.Blue6[0], schemes.brewer.Blues6[0]], 
                        [schemes.brewer.Oranges6[0], schemes.office.Orange6[0]]]
        this.requestData();
    }
});

export default Category;