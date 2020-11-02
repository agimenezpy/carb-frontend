import Vue from 'vue';
import { Bar, mixins } from 'vue-chartjs';
import { formatter } from './index';

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
        },
        aspect: Boolean
    },
    data() {
        return {
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            display: false,
                            beginAtZero: false,
                            callback: (label: number) => {
                                if (label < 1e3) return formatter(label);
                                if (label >= 1e6) return formatter(label / 1e6) + "M";
                                if (label >= 1e3) return formatter(label / 1e3) + "K";
                            }
                        },
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: false, labelString: "Litros"
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
                    display: this.chartData.legend !== undefined && this.chartData.legend,
                    position: 'right',
                    labels: {
                        fontSize: 10,
                        boxWidth: 10
                    }
                },
                title: {
                    display: this.title !== undefined,
                    text: this.title
                },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => formatter(item.yLabel)
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
                        formatter: (value: any, context: any) => (
                            formatter(value / this.chartData.div)
                        )
                    }
                },
                maintainAspectRatio: this.aspect
            }
        };
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

export default ProductChart;