import Vue from 'vue';
import { Line, mixins } from 'vue-chartjs';

const fmt = Intl.NumberFormat('es-PY', {maximumFractionDigits: 4}).format;

const PriceMonthsChart = Vue.extend({
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
                            display: true,
                            beginAtZero: true,
                            callback: (label: number) => {
                                return fmt(label);
                            }
                        },
                        gridLines: { display: true },
                        scaleLabel: { display: false, labelString: "Dolares" }
                    }],
                    xAxes: [{
                        ticks: { display: true },
                        gridLines: { display: false },
                        scaleLabel: { display: false, labelString: "Mes" }
                    }]
                },
                legend: { display: true },
                title: { display: this.title !== undefined, text: this.title  },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => (
                            fmt(data.datasets[item.datasetIndex].data[item.index])
                        )
                    }
                },
                plugins: {
                    datalabels: {
                        display: false,
                        labels: {
                            value: {
                                font: {weight: 'bold'},
                            }
                        },
                        align: (item: any) => {
                            return item.datasetIndex === 0 ? 'end' : 'start';
                        },
                        formatter:  (label: number) => {
                            return fmt(label);
                        }
                    },
                    colorschemes: {
                        scheme: this.chartData.colors,
                    }
                },
                maintainAspectRatio: false
            }
        };
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

export default PriceMonthsChart;