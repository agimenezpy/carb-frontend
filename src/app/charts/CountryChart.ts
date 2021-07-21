import Vue from 'vue';
import { Pie, mixins } from 'vue-chartjs';

const CountryChart = Vue.extend({
    extends: Pie,
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
                legend: {
                    display: false
                },
                title: {
                    display: false,
                    text: this.title
                },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => {
                            const value = Intl.NumberFormat().format(data.datasets[item.datasetIndex].data[item.index]);
                            return `${data.labels[item.index]}:${value}`;
                        }
                    }
                },
                rotation: this.chartData.rotate || 1 * 0.2 * Math.PI,
                plugins: {
                    datalabels: {
                        formatter: (value: any, context: any) => {
                            const dataset = context.chart.data.datasets[0];
                            const total = dataset.data.reduce((prevValue: number, curValue: number) => prevValue + curValue);
                            const percentage = Math.round((value / total) * 100);
                            const label = context.chart.data.labels[context.dataIndex];
                            return `${label}\n${percentage}%`;
                        },
                        color: this.chartData.color || "#444444",
                        anchor: "end",
                        clamp: true,
                        align(item: any) {
                            if (item.chart.data.labels.length < 4) {
                                return "start" ;
                            }
                            const codigo =  item.chart.data.labels[item.dataIndex];
                            if (codigo === "OTROS") {
                                return "bottom";
                            }
                            else if (codigo === "ARGENTINA") {
                                return "left";
                            }
                            else {
                                return "right";
                            }
                        },
                        textAlign: "center",
                        labels: {
                            value: {
                                font: {
                                    weight: 'bold',
                                    size: '11'
                                }
                            }
                        }
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


export default CountryChart;