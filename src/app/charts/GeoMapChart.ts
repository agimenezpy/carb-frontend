import Vue from 'vue';
import { generateChart, mixins } from 'vue-chartjs';

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
        return {
            options: {
                showOutline: false,
                showGraticule: false,
                legend: {
                  display: false,
                },
                scale: {
                  projection: 'naturalEarth1',
                },
                geo: {
                    colorScale: {
                        display: true,
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
                                font: {size: "9"},
                            }
                        },
                        align: (item: any) => {
                            const codigo =  item.dataset.data[item.dataIndex].feature.properties.codigo;
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
                        color: "#444444",
                        textAlign: "center",
                        formatter: (item: any) => {
                            return `${item.feature.properties.nombre}\n(${item.value})`;
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