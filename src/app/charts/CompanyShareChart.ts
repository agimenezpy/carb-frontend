import Vue from 'vue';
import { Pie, mixins } from 'vue-chartjs';

function getPercentaje(context: any) {
    const dataset = context.chart.data.datasets[0];
    const value = dataset.data[context.dataIndex];
    const total = dataset.data.reduce((prevValue: number, curValue: number) => prevValue + curValue);
    return Math.round((value / total) * 100);
}

const CompanyShareChart = Vue.extend({
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
                            const value = Intl.NumberFormat('es-PY', {maximumFractionDigits: 2}).format(
                                data.datasets[item.datasetIndex].data[item.index] / 1e6
                            );
                            return `${data.labels[item.index]}:${value}`;
                        }
                    }
                },
                rotation: 0.5 * Math.PI,
                plugins: {
                    datalabels: {
                        rotation(context: any) {
                            const perc = getPercentaje(context);
                            return (perc < 5) ? -90 : 0;
                        },
                        formatter: (value: any, context: any) => {
                            const perc = getPercentaje(context);
                            const label = context.chart.data.labels[context.dataIndex];
                            return (perc < 5) ? `${label} ${perc}%` : `${label}\n${perc}%`;
                        },
                        color: "#000000",
                        anchor(context: any) {
                            const perc = getPercentaje(context);
                            return (perc < 5) ? "end" : "center";
                        },
                        align(context: any) {
                            const perc = getPercentaje(context);
                            return (perc < 5) ? "start" : "end";
                        },
                        textAlign: "center",
                        labels: {
                            value: {
                                font: {
                                    weight: 'bold',
                                    size: '10'
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


export default CompanyShareChart;