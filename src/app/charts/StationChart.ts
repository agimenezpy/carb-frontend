import Vue from 'vue';
import { Bar, mixins } from 'vue-chartjs';

const StationChart = Vue.extend({
    extends: Bar,
    mixins: [ mixins.reactiveProp ],
    props: {
        chartData: {
            type: Object,
            required: false
        },
        title: String,
        aspect: Boolean
    },
    data() {
        return {
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            display: false,
                            beginAtZero: true
                        },
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: false, labelString: "Estaciones"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            display: true,
                            fontSize: 8,
                            maxRotation: 45,
                            minRotation: 45
                        },
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false, labelString: this.title
                        }
                    }]
                },
                legend: {
                    display: false
                },
                title: {
                    display: false,
                    text: this.title
                },
                tooltips: {
                    callbacks: {
                        label: (item: any) => Intl.NumberFormat().format(item.yLabel)
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
                        rotation: 0,
                        clamp: true,
                        anchor: 'end',
                        align: 'top',
                        offset: 1,
                        formatter: (value: number) => Intl.NumberFormat().format(value)
                    },
                    colorschemes: {
                        scheme: this.chartData.colors
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

export default StationChart;