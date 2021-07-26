import Vue from 'vue';
import { generateChart, mixins } from 'vue-chartjs';
import { formatter } from './index';


const GeoMapChart = Vue.extend({
    extends: generateChart("choropleth", "choropleth"),
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
        let items = -1;
        return {
            options: {
                showGraticule: false,
                legend: {
                  display: false,
                },
                scale: {
                  projection: 'naturalEarth1',
                },
                geo: {
                    colorScale: {
                        interpolate: (typeof this.chartData.colors === "object") ?
                            (v: number) => {
                                const len = this.chartData.colors.length;
                                items = (items + 1) % len;
                                return (this.chartData.datasets[0].data[items].value > 0) ? this.chartData.colors[items] : '#FFFFFF';
                            } : 'Blues',
                        display: this.chartData.datasets[0].data.length > 3,
                        position: 'top',
                        quantize: 5,
                        legend: {
                            position: 'top-right',
                        }
                    }
                },
                plugins: {
                    datalabels: {
                        display: true,
                        labels: {
                            value: {
                                font: {size: this.chartData.fontSize || "9"},
                            }
                        },
                        align: (item: any) => {
                            const prop = item.dataset.data[item.dataIndex].feature.properties;
                            const codigo =  prop.codigo || prop.iso_a2;
                            if (codigo.match(/00/)) {
                                return "top";
                            }
                            else if (codigo.match(/12|11/)) {
                                return "left";
                            }
                            else if (codigo.match(/13/)) {
                                return "right";
                            }
                            else if (codigo === "") {
                                return "bottom";
                            }
                            else {
                                return "center";
                            }
                        },
                        color: this.chartData.color || "#444444",
                        textAlign: "center",
                        formatter: (item: any) => {
                            if (item.value > 0) {
                                const label = item.feature.properties.nombre || item.feature.properties.admin;
                                const value = formatter(item.value);
                                return `${label}\n${value}`;
                            }
                            else {
                                return "";
                            }
                        }
                    },
                    colorschemes: {
                        scheme: ''
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


export default GeoMapChart;