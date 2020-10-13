import Vue from 'vue';
import { Bar, mixins } from 'vue-chartjs';
import { Chart } from 'chart.js';
import Loader from './Loader';
import { DualFilterUtil } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class="card-content">
            <h5>{{header}}</h5>
            <Loader v-if="!loaded"/>
            <product-chart v-if="loaded" :chart-data="chartData"></product-chart>
        </div>
    </div>
</div>`;

interface Record {
    volumen: number,
    producto: string
}

const ProductChart = Vue.extend({
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
                        color: "#444444",
                        labels: {
                            value: {
                                font: {weight: 'bold'},
                            }
                        },
                        rotation: -90,
                        clamp: true,
                        anchor: 'start',
                        align: 'end',
                        formatter: (value: any, context: any) => Intl.NumberFormat().format(value)
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

const Product = Vue.extend({
    name: "Product",
    components: {
        ProductChart, Loader
    },
    mixins: [DualFilterUtil],
    template,
    data() {
        return {
            loaded: false,
            chartData: {},
            colors: []
        }
    },
    props: {
        header: String,
        xclass: String
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByProduct").then(this.updateChart);
        },
        updateChart(filters: object = {}) {
            this.loaded = false;
            const products: Map<string, string> = this.$store.getters.getProducts;
            let rawData: Record[] = this.$store.getters.getProdData;

            const labels: string[] = [];
            const volumes: number[] = [];

            if (!this.isEmpty(filters)) {
                rawData = this.filterDualData(filters, rawData);
            }

            products.forEach((value, key) => {
                const qs = rawData.filter(item => item.producto === key);

                const vol = qs.reduce((sum, item) => sum + item.volumen, 0);
                if (vol > 0) {
                    labels.push(value);
                    volumes.push(vol)
                }
            })
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: string[], volumes: number[]) {
            this.chartData = {
                labels,
                datasets: [
                    {
                        backgroundColor: this.colors,
                        data: volumes
                    }
                ]
            };
        }
    },
    mounted() {
        const schm: any = Chart.colorschemes;
        this.colors = schm.office.Blue6.slice(0, 2).concat(schm.office.Orange6);
        this.requestData();
    }
});

export default Product;