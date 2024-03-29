import Vue from 'vue';
import { Line, mixins } from 'vue-chartjs';
import { formatter } from './index';

const CategoryMonthsChart = Vue.extend({
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
                            display: false,
                            beginAtZero: true,
                            callback: (label: number) => {
                                if (label < 1e3) return formatter(label);
                                if (label >= 1e6) return formatter(label / 1e6) + "M";
                                if (label >= 1e3) return formatter(label / 1e3) + "K";
                            }
                        },
                        gridLines: { display: true },
                        scaleLabel: { display: false, labelString: "Litros" }
                    }],
                    xAxes: [{
                        ticks: { display: true },
                        gridLines: { display: false },
                        scaleLabel: { display: false, labelString: "Mes" }
                    }]
                },
                legend: { display: true },
                title: {
                    display: this.title !== undefined,
                    text: this.title
                },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => {
                            const div = typeof this.chartData.div === "number" ? this.chartData.div : 1e6;
                            return formatter(data.datasets[item.datasetIndex].data[item.index] / div);
                        }
                    }
                },
                plugins: {
                    datalabels: {
                        display: this.chartData.showLabels || false,
                        labels: {
                            value: {
                                font: {weight: 'bold'},
                            }
                        },
                        align: (item: any) => {
                            return item.datasetIndex === 0 ? 'end' : 'start';
                        },
                        formatter:  (label: number) => {
                            const div = typeof this.chartData.div === "number" ? this.chartData.div : 1e6;
                            return formatter(label / div);
                        }
                    },
                    colorschemes: { scheme: this.chartData.colors }
                },
                maintainAspectRatio: false
            }
        };
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});


export default CategoryMonthsChart;