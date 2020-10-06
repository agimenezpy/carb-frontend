import Vue from 'vue';
import { Doughnut, mixins } from 'vue-chartjs';
import ChartDataLabels from 'chartjs-plugin-datalabels';

var template = `<div class="card block">
    <div class='card-content'>
        <h5>{{header}}</h5>
        <category-chart v-if="loaded" :chart-data="volumes" :chart-labels="labels" :title="title"></category-chart>
    </div>
</div>`;

const CategoryChart = Vue.extend({
    extends: Doughnut,
    mixins: [ mixins.reactiveProp ],
    props: {
        chartData: {
            type: Array,
            required: false
        },
        chartLabels: {
            type: Array,
            required: true
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
                rotation: (this.title == "GASOIL" ? 1 : -1)*0.5 * Math.PI,
                plugins: {
                    datalabels: {
                        color: '#FFFFFF',
                        formatter: (value: any, context: any) => {
                            let dataset = context.chart.data.datasets[0];
                            var total = dataset.data.reduce((previousValue: number, currentValue: number) => previousValue + currentValue);
                            var currentValue = dataset.data[context.dataIndex];
                            var percentage = Math.floor(((currentValue/total) * 100)+0.5);         
                            return percentage + "%";
                        }
                    },
                    colorschemes: {
                        scheme: this.title == "GASOIL" ? 'office.Blue6' : 'office.Orange6'
                    }
                },
                maintainAspectRatio: true
            }
        }
    },
    mounted() {
        this.renderChart({
            plugins: [ChartDataLabels],
            labels: this.chartLabels,
            datasets: [
                {
                    data:  this.chartData
                }
            ]
        }, this.options);
    }
});

const Category = Vue.extend({
    name: "Category",
    components: {
        CategoryChart
    },
    template,
    data() {
        return {
            loaded: false,
            labels: [],
            volumes: [],
            title: ""
        }
    },
    props: {
        header: String,
        type: String,
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByCategory").then(() => {
                let categories: Map<String, String> = this.$store.getters.getCategories;
                let rawData: object[] = this.$store.getters.getCatData;

                this.labels = [];
                this.volumes = [];
                categories.forEach((value, key) => {
                    let vol =  rawData.filter(item => item["categoria"] === key)
                                      .reduce((sum, item) => sum + item["volumen"], 0);
                    if (vol > 0) {
                        this.labels.push(value);
                        this.volumes.push(vol)
                    }
                })
                this.title = categories.get(this.type);
                this.loaded = true;
            });
        }
    },
    mounted() {
        this.requestData();
    }
});

export default Category;