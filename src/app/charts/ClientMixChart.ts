import Vue from 'vue';
import { HorizontalBar, mixins } from 'vue-chartjs';
import { formatter } from './index';

const ClientMixChart = Vue.extend({
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
                        scaleLabel: {
                            display: false, labelString: "Clientes"
                        }
                    }]
                },
                legend: {
                    display: true
                },
                title: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        label: (item: any) => formatter(item.xLabel / 1e6)
                    }
                },
                plugins: {
                    datalabels: {
                        display: false,
                        clamp: true,
                        anchor: 'start',
                        align: 'end',
                        formatter: (value: any) => formatter(value)
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

export default ClientMixChart;