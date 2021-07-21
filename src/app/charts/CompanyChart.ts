import Vue from 'vue';
import { HorizontalBar, Bar, mixins } from 'vue-chartjs';
import { formatter } from './index';

const CompanyChart = Vue.extend({
    extends: HorizontalBar,
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
                    xAxes: [{
                        ticks: {
                            display: this.chartData.showTicks || true,
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
                    yAxes: [{
                        ticks: { display: true },
                        gridLines: { display: false },
                        scaleLabel: { display: false, labelString: "Empresas" }
                    }]
                },
                legend: { display: true },
                title: { display: this.title !== undefined, text: this.title },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => formatter(item.xLabel)
                    }
                },
                plugins: {
                    datalabels: {
                        display: this.chartData.showLabels || false,
                        clamp: true,
                        color: "#444444",
                        labels: {
                            value: {
                                font: {weight: 'bold'},
                            }
                        },
                        rotation: 0,
                        anchor: 'end',
                        align: 'end',
                        formatter: (value: any, context: any) => formatter(value)
                    },
                    colorschemes: {  scheme: 'office.Office6' }
                },
                maintainAspectRatio: false
            }
        };
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

const CompanyBarChart = Vue.extend({
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
                                 maxRotation: this.chartData.xLabelRotation || 45,
                                 minRotation: this.chartData.xLabelRotation || 45
                               },
                        gridLines: { display: false },
                        scaleLabel: { display: false, labelString: "Empresas" }
                    }]
                },
                legend: { display: false },
                title: { display: this.title !== undefined, text: this.title },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => formatter(item.yLabel)
                    }
                },
                plugins: {
                    datalabels: {
                        display: this.chartData.showLabels || false,
                        clamp: true,
                        color: "#444444",
                        labels: {
                            value: {
                                font: {weight: 'bold'},
                            }
                        },
                        rotation: this.chartData.labelRotation || -90,
                        anchor: 'end',
                        align: 'end',
                        formatter: (value: any, context: any) => formatter(value)
                    },
                    colorschemes: {  scheme: 'office.Office6' }
                },
                maintainAspectRatio: false
            }
        };
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

export { CompanyChart, CompanyBarChart };