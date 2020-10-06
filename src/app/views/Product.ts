import Vue from 'vue';
import { Bar, mixins } from 'vue-chartjs';
import {Chart} from 'chart.js';

var template = `<div class="card block">
    <div class="card-content">
        <h5>{{header}}</h5>
        <product-chart v-if="loaded" :chart-data="volumes" :chart-labels="labels"></product-chart>
    </div>
</div>`;

const ProductChart = Vue.extend({
    extends: Bar,
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
                            display: false, labelString: "Productos"
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
                        label: (item: any, data: any) => Intl.NumberFormat().format(item.yLabel)
                    }
                },
                plugins: {
                    datalabels: {
                        display: true,
                        rotation: -90,
                        clamp: true,
                        anchor: 'start',
                        align: 'end',
                        formatter: (value: any, context: any) => Intl.NumberFormat().format(value)
                    }
                },
                maintainAspectRatio: true
            },
            colors: Chart["colorschemes"]
             //;["#1f4e79", "#2e75b6", "#ed7d31", "#ffc000", "#c55a11", "#ed7d31"]
        }
    },
    mounted() {
        this.renderChart({
            labels: this.chartLabels,
            datasets: [
                {
                    backgroundColor: this.colors.office.Office6,
                    data: this.chartData
                }
            ]
        }, this.options);
    }
});

const Product = Vue.extend({
    name: "Product",
    components: {
        ProductChart
    },
    template,
    data() {
        return {
            loaded: false,
            labels: [],
            volumes: []
        }
    },
    props: {
        header: String
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByProduct").then(() => {
                let products: Map<String, String> = this.$store.getters.getProducts;
                let rawData: object[] = this.$store.getters.getProdData;

                this.labels = [];
                this.volumes = [];
                products.forEach((value, key) => {
                    let vol =  rawData.filter(item => item["producto"] === key)
                                      .reduce((sum, item) => sum + item["volumen"], 0);
                    if (vol > 0) {
                        this.labels.push(value);

                        this.volumes.push(vol)
                    }
                })
                this.loaded = true;
            });
        }
    },
    mounted() {
        this.requestData();
    }
});

export default Product;