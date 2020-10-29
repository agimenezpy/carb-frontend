import Vue from 'vue';
import { Doughnut, mixins } from 'vue-chartjs';

const CategoryChart = Vue.extend({
    extends: Doughnut,
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
                    display: this.chartData.legend
                },
                title: {
                    display: !this.chartData.legend && this.title !== undefined,
                    text: this.title
                },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => Intl.NumberFormat().format(data.datasets[item.datasetIndex].data[item.index])
                    }
                },
                rotation: (!this.chartData.invert ? 1 : -1) * 0.5 * Math.PI,
                plugins: {
                    datalabels: {
                        display: (context: any) => {
                            if (this.chartData.invert !== undefined) {
                                return (!this.chartData.invert && context.dataIndex === 0 ||
                                    this.chartData.invert && context.dataIndex === 1);
                            }
                            else {
                                return true;
                            }
                        },
                        formatter: (value: any, context: any) => {
                            const dataset = context.chart.data.datasets[0];
                            const total = dataset.data.reduce((prevValue: number, curValue: number) => prevValue + curValue);
                            const currentValue = dataset.data[context.dataIndex];
                            const percentage = Math.round((currentValue / total) * 100);
                            return percentage + "%";
                        },
                        color: 'white',
                        labels: {
                            value: {
                                font: {
                                    weight: 'bold',
                                    size: '16'
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

export default CategoryChart;