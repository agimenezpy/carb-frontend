import Vue from 'vue';
import { Line, mixins } from 'vue-chartjs';

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
        },
        amountType: String
    },
    data() {
        return {
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            display: false, // this.amountType === "short",
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
                            display: false, labelString: "Mes"
                        }
                    }]
                },
                legend: { display: true },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => {
                            const value = data.datasets[item.datasetIndex].data[item.index];
                            const fmt = Intl.NumberFormat('es-PY', {maximumFractionDigits: 2}).format;
                            return (this.amountType === "short") ? fmt(value / 1e6) : fmt(value);
                        }
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
                        align: 'end',
                        formatter: (value: number, context: any) => {
                            const fmt = Intl.NumberFormat('es-PY', {maximumFractionDigits: 2}).format;
                            return (this.amountType === "short") ? fmt(value / 1e6) : fmt(value);
                        }
                    },
                    colorschemes: {
                        scheme: 'office.Office6'
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

export default CategoryTimeChart;