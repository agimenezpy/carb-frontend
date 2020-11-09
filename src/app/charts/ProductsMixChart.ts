import Vue from 'vue';
import { HorizontalBar, mixins } from 'vue-chartjs';
import { formatter } from './index';

const ProductsMixChart = Vue.extend({
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
                layout: {
                    padding: {
                      left: 5
                    }
                },
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
                            display: false, labelString: "Productos"
                        }
                    }]
                },
                legend: {
                    display: true,
                    position: 'right',
                    labels: {
                        fontSize: 10,
                        boxWidth: 10
                    }
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
        this.addPlugin({
            id: 'multi-line',
            beforeInit(context: any) {
                context.data.labels.forEach((label: string, idx: number, array: any) => {
                    if (/\n/.test(label)) {
                        array[idx] = label.split("\n");
                    }
                });
            }
        });
        this.renderChart(this.chartData, this.options);
    }
});

export default ProductsMixChart;