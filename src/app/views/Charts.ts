import Vue from 'vue';
import { Chart } from 'chart.js';
import { Doughnut, Line, Bar, HorizontalBar, generateChart, mixins } from 'vue-chartjs';
import 'chartjs-plugin-colorschemes';
import 'chartjs-plugin-datalabels';
import * as ChartGeo from 'chartjs-chart-geo';

interface ColorSchemesType {
    [propName: string]: any;
}

interface TopoJSONType {
    [propName: string]: any;
}

class ColorSchemes {
    static getColorSchemes(): ColorSchemesType {
        return Chart["colorschemes"];
    }
}

function getTopoJSON() {
    return ChartGeo.topojson;
}

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
                    display: false
                },
                title: {
                    display: this.title !== undefined,
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
                            return !this.chartData.invert && context.dataIndex === 0 ||
                                    this.chartData.invert && context.dataIndex === 1;
                        },
                        formatter: (value: any, context: any) => {
                            const dataset = context.chart.data.datasets[0];
                            const total = dataset.data.reduce((prevValue: number, curValue: number) => prevValue + curValue);
                            const currentValue = dataset.data[context.dataIndex];
                            const percentage = Math.floor(((currentValue / total) * 100) + 0.5);
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

const CategoryMonthsChart = Vue.extend({
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
        }
    },
    data() {
        return {
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            display: true,
                            beginAtZero: true,
                            callback: (label: number) => {
                                const fmt = Intl.NumberFormat().format;
                                if (label < 1e3) return fmt(label);
                                if (label >= 1e6) return fmt(label / 1e6) + "M";
                                if (label >= 1e3) return fmt(label / 1e3) + "K";
                            }
                        },
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true, labelString: "Litros"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            display: true
                        },
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false, labelString: "Mes"
                        }
                    }]
                },
                legend: {
                    display: true
                },
                title: {
                    display: this.title !== undefined,
                    text: this.title
                },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => Intl.NumberFormat().format(data.datasets[item.datasetIndex].data[item.index])
                    }
                },
                plugins: {
                    datalabels: {
                        display: true,
                        labels: {
                            value: {
                                font: {weight: 'bold'},
                            }
                        },
                        align: 'end',
                        formatter:  (label: number) => {
                            const fmt = Intl.NumberFormat('es-PY', {maximumFractionDigits: 2}).format;
                            return fmt(label / 1e6);
                        }
                    },
                    colorschemes: {
                        scheme: this.chartData.colors,
                        custom: (scheme: string[]) => {
                            return this.chartData.colors.match("Blue") ? scheme : [scheme[1], scheme[0]];
                        }
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
                            display: this.amountType === "short",
                            beginAtZero: true,
                            callback: (label: number) => {
                                const fmt = Intl.NumberFormat().format;
                                if (label < 1e3) return fmt(label);
                                if (label >= 1e6) return fmt(label / 1e6) + "M";
                                if (label >= 1e3) return fmt(label / 1e3) + "K";
                            }
                        },
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Litros"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            display: true
                        },
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false, labelString: "Mes"
                        }
                    }]
                },
                legend: { display: true },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => (Intl.NumberFormat().format(data.datasets[item.datasetIndex].data[item.index]))
                    }
                },
                plugins: {
                    datalabels: {
                        display: true,
                        labels: {
                            value: {
                                font: {weight: 'bold'},
                            }
                        },
                        align: 'end',
                        formatter: (value: number, context: any) => {
                            const fmt = Intl.NumberFormat('es-PY', {maximumFractionDigits: 2}).format;
                            return (this.amountType === "short") ? fmt(value / 1e6) : fmt(value);
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

const CategoryYearsChart = Vue.extend({
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
                            beginAtZero: true,
                            callback: (label: number) => {
                                const fmt = Intl.NumberFormat().format;
                                if (label < 1e3) return fmt(label);
                                if (label >= 1e6) return fmt(label / 1e6) + "M";
                                if (label >= 1e3) return fmt(label / 1e3) + "K";
                            }
                        },
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Litros"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            display: true
                        },
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false, labelString: "Tipo"
                        }
                    }]
                },
                legend: {
                    display: false
                },
                title: {
                    display: this.title !== undefined,
                    text: this.title
                },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => Intl.NumberFormat().format(data.datasets[item.datasetIndex].data[item.index])
                    }
                },
                plugins: {
                    datalabels: {
                        color: "white",
                        display: true,
                        rotation: -90,
                        clamp: true,
                        anchor: 'start',
                        align: 'end',
                        formatter: (value: any, context: any) => Intl.NumberFormat().format(value)
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
                            beginAtZero: true,
                            callback: (label: number) => {
                                const fmt = Intl.NumberFormat().format;
                                if (label < 1e3) return fmt(label);
                                if (label >= 1e6) return fmt(label / 1e6) + "M";
                                if (label >= 1e3) return fmt(label / 1e3) + "K";
                            }
                        },
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true,
                            labelString: "Litros"
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            display: true
                        },
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false, labelString: "Empresas"
                        }
                    }]
                },
                legend: {
                    display: true
                },
                title: {
                    display: this.title !== undefined,
                    text: this.title
                },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => Intl.NumberFormat().format(item.xLabel)
                    }
                },
                plugins: {
                    datalabels: {
                        display: false,
                        clamp: true,
                        anchor: 'start',
                        align: 'end',
                        formatter: (value: any, context: any) => Intl.NumberFormat().format(value)
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

const ProductChart = Vue.extend({
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
        },
        aspect: Boolean
    },
    data() {
        return {
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            display: false,
                            beginAtZero: false,
                            callback: (label: number) => {
                                const fmt = Intl.NumberFormat().format;
                                if (label < 1e3) return fmt(label);
                                if (label >= 1e6) return fmt(label / 1e6) + "M";
                                if (label >= 1e3) return fmt(label / 1e3) + "K";
                            }
                        },
                        gridLines: {
                            display: true
                        },
                        scaleLabel: {
                            display: true, labelString: "Litros"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            display: true
                        },
                        gridLines: {
                            display: false
                        },
                        scaleLabel: {
                            display: false, labelString: "Productos"
                        }
                    }]
                },
                legend: {
                    display: false
                },
                title: {
                    display: this.title !== undefined,
                    text: this.title
                },
                tooltips: {
                    callbacks: {
                        label: (item: any, data: any) => Intl.NumberFormat().format(item.yLabel)
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
                        rotation: -90,
                        clamp: true,
                        anchor: 'start',
                        align: 'end',
                        formatter: (value: any, context: any) => Intl.NumberFormat().format(value)
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
                            display: true, labelString: "Estaciones"
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            display: true,
                            fontSize: 8,
                            maxRotation: 90,
                            minRotation: 90
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
                    display: this.title !== undefined,
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
                        clamp: false,
                        anchor: 'end',
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
                        align: 'top',
                        formatter: (item: any) => {
                            return `${item.value}`;
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

export {
    ColorSchemes, CategoryChart, CategoryMonthsChart, StationChart,
    CategoryTimeChart, CategoryYearsChart, CompanyChart, ProductChart,
    getTopoJSON, TopoJSONType, GeoMapChart
};