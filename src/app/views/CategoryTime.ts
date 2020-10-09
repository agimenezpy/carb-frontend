import Vue from 'vue';
import { Line, mixins } from 'vue-chartjs';
import DualFilterUtil from './mixins';
import Loader from './Loader';

var template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <h5>{{header}} de {{title}}</h5>
            <Loader v-if="!loaded"/>
            <category-time-chart v-if="loaded" :chart-data="chartData" :title="subtitle"></category-time-chart>
        </div>
    </div>
</div>`;

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
                                let fmt = Intl.NumberFormat().format;
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
                        labels:{
                            value: { 
                                font: {weight: 'bold'},
                            }
                        },
                        align: 'end',
                        formatter: (value: any, context: any) => Intl.NumberFormat().format(value)
                    },
                    colorschemes: {
                        scheme: 'office.Office6'
                    }
                },
                maintainAspectRatio: false
            }
        }
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

const CategoryTime = Vue.extend({
    name: "CategoryTime",
    components: {
        CategoryTimeChart, Loader
    },
    mixins: [DualFilterUtil],
    template,
    data() {
        return {
            loaded: false,
            chartData: {},
            title: "",
            subtitle: ""
        }
    },
    props: {
        header: String,
        xclass: String,
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByCategory").then(this.updateChart);
        },
        updateChart(filters: object = {}) {
            this.loaded = false;
            let categories: Map<String, String> = this.$store.getters.getCategories;
            let rawData: object[] = this.$store.getters.getCatData;
            let lastDate = rawData[rawData.length - 1]["fecha"];
            let lastYear = parseInt(lastDate.split("-")[0]);
            let lastMonth = parseInt(lastDate.split("-")[1]);
            

            let labels: object = {
                "months": [],
                "categories": Array.from(categories).map(item => (item[1]))
            };
            let volumes: object[] = [];
            let fMonth = filters["fMonth"];

            if (!this.isEmpty(filters)) {
                rawData = this.filterCompData(filters, rawData);
            }

            let maxMonth = 0;
            let months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);
            categories.forEach((value, key) => {
                let vols: number[] = [];
                months.forEach((month) => {
                    let thisMonth = this.MONTHS[month - 1];
                    if (fMonth !== undefined && fMonth.indexOf(thisMonth) < 0) {
                        return;
                    }
                    let fmt: string = `${lastYear}-0${month}-01`;
                    if (month > 10) {
                        fmt = `${lastYear}-${month}-01`;
                    }
                    let vol =  rawData.filter(item => item["categoria"] === key && item["fecha"] === fmt)
                                      .reduce((sum, item) => sum + item["volumen"], 0);
                    vols.push(vol);
                    if (labels["months"].length < months.length && month > maxMonth) {
                        labels["months"].push(thisMonth);
                        maxMonth = month;
                    }
                });
                
                volumes.push(vols);
            })
            this.setChartData(`Año ${lastYear}`, labels, volumes);
            this.loaded = true;
        },
        setChartData(title: string, labels: object[], volumes: object[]) {
            this.subtitle = title;
            this.title = labels["categories"].join(" y ");
            this.chartData = {
                labels: labels["months"],
                datasets: [{
                    label: labels["categories"][0],
                    data: volumes[0],
                    lineTension: 0,
                    fill: false
                },
                {
                    label: labels["categories"][1],
                    data: volumes[1],
                    lineTension: 0,
                    fill: false
                }]
            }
        }
    },
    mounted() {
        this.requestData();
    }
});

export default CategoryTime;