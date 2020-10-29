import Vue from 'vue';
import { Bar, mixins } from 'vue-chartjs';

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
                        formatter: (value: any, context: any) => (
                            Intl.NumberFormat('es-PY', {maximumFractionDigits: 2}).format(value / this.chartData.div)
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