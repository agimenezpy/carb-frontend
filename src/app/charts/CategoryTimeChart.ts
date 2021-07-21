import Vue from 'vue';
import { Line, Bar, mixins } from 'vue-chartjs';
import { formatter } from './index';

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
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => {
                            const value = data.datasets[item.datasetIndex].data[item.index];
                            return (this.amountType === "short") ? formatter(value / 1e6) : formatter(value);
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
                            return (this.amountType === "short") ? formatter(value / 1e6) : formatter(value);
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

const CategoryBarTimeChart = Vue.extend({
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
                            display: this.chartData.showTicks || false,
                            beginAtZero: true,
                            callback: (label: number) => {
                                if (label < 1e3) return formatter(label);
                                if (label >= 1e6) return formatter(label / 1e6) + "M";
                                if (label >= 1e3) return formatter(label / 1e3) + "K";
                            }
                        },
                        gridLines: { display: this.chartData.showTicks || false },
                        scaleLabel: { display: false, labelString: this.chartData.yLabel || "" }
                    }],
                    xAxes: [{
                        ticks: { display: true, fontSize: 10,
                                 maxRotation: (this.chartData.xLabelRotation) !== undefined ? this.chartData.xLabelRotation : 45,
                                 minRotation: (this.chartData.xLabelRotation) !== undefined ? this.chartData.xLabelRotation : 45 },
                        gridLines: { display: false },
                        scaleLabel: { display: false, labelString: "Mes" }
                    }]
                },
                legend: { display: false },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => formatter(item.yLabel)
                    }
                },
                plugins: {
                    datalabels: {
                        display:  this.chartData.showLabels || false,
                        clamp: true,
                        color: "#444444",
                        labels: {
                            value: {
                                font: {weight: 'bold'},
                            }
                        },
                        rotation: (this.chartData.labelRotation) !== undefined ? this.chartData.labelRotation : -90,
                        anchor: 'end',
                        align: 'end',
                        formatter: (value: any, context: any) => formatter(value)
                    },
                    colorschemes: { scheme: 'office.Office6' }
                },
                maintainAspectRatio: false
            }
        };
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

export { CategoryTimeChart, CategoryBarTimeChart };