import Vue from 'vue';
import { HorizontalBar, mixins } from 'vue-chartjs';
import Loader from './Loader';
import DualFilterUtil from './mixins';

var template = `<div :class="[xclass]">
    <div class="card">
        <div class="card-content">
            <h5>{{header}}</h5>
            <Loader v-if="!loaded"/>
            <company-chart v-if="loaded" :chart-data="chartData"></company-chart>
        </div>
    </div>
</div>`;

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
        }
    },
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

const Company = Vue.extend({
    name: "Company",
    components: {
        CompanyChart, Loader
    },
    mixins: [DualFilterUtil],
    template,
    data() {
        return {
            loaded: false,
            chartData: {}
        }
    },
    props: {
        header: String,
        xclass: String
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByCompany").then(this.updateChart);
        },
        updateChart(filters: object = {}){
            this.loaded = false;
            let companies: Map<number, string> = this.$store.getters.getCompanies;
            let category: Map<string, string> = this.$store.getters.getComCategory;
            let rawData: object[] = this.$store.getters.getComData;
            let lastDate = rawData[rawData.length - 1]["fecha"];
            let lastYear = parseInt(lastDate.split("-")[0]);
            let fMonth = filters["fMonth"];
            let fComp = filters["fComp"];

            let labels = {
                "companies": new Array<string>(),
                "categories": Array.from(category).map(item => (item[1]))
            };
            let volumes: object[] = [];
            let months = "";
            if (fMonth !== undefined) {
                months = fMonth.map((mItem: string) => this.MONTHS.indexOf(mItem) + 1).join("|")
            }

            companies.forEach((value, key) => {
                let vols: Array<number> = [];
                let total: number = 0;
                if (fComp !== undefined && fComp.indexOf(key) < 0) {
                    return;
                }
                category.forEach((cat, catkey) => {
                    let qs =  rawData.filter(item => item["distribuidor"] === key && item["categoria"] == catkey);
                    if (fMonth !== undefined) {
                        qs = qs.filter(item => item["fecha"].match(`${lastYear}-0?(${months})-01`))
                    }
                                        
                    let vol = qs.reduce((sum, item) => sum + item["volumen"], 0);
                    vols.push(vol);
                    total += vol;
                })
                if (total > 0) {
                    labels["companies"].push(this.cleanNames(value))
                    volumes.push(vols);
                }
            })
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        cleanNames(item: string): any {
            let result = item;
            const regex = / (PARAGUAY|SAECA|SAE|SRL|SA)/gi;
            result = result.replace(regex, "");
            return result;
        },
        setChartData(labels: object, volumes: object[]) {
            this.chartData = {
                labels: labels["companies"],
                datasets: [{
                    label: labels["categories"][0],
                    data: volumes.map((item: any) => (item[0]))
                },
                {
                    label: labels["categories"][1],
                    data: volumes.map((item: any) => (item[1]))
                }]
            }
        }
    },
    mounted() {
        this.requestData();
    }
});

export default Company;