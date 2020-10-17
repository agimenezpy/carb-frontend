import Vue from 'vue';
import Loader from './Loader';
import { CategoryMonthsChart  } from './Charts';
import { FilterUtil, FilterObj, Record, WatchMonth } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <h5 class="font-size--1">{{header}} para {{title}}</h5>
            <Loader v-if="!loaded && !error"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <category-months-chart v-if="loaded" :chart-data="chartData" :styles="styles"></category-months-chart>
        </div>
    </div>
</div>`;

interface Labels {
    [propName: string]: any;
}

const CategoryMonths = Vue.extend({
    name: "CategoryMonths",
    components: {
        CategoryMonthsChart, Loader
    },
    mixins: [FilterUtil, WatchMonth],
    template,
    data() {
        return {
            loaded: false,
            title: "",
            chartData: {},
            error: false
        };
    },
    props: {
        header: String,
        type: String,
        xclass: String,
        styles: Object
    },
    methods: {
        onError(status: number) {
            this.loaded = false;
            this.error = status > 0;
        },
        updateChart(filters: FilterObj = {}) {
            this.loaded = false;
            const categories: Map<string, string> = this.categories;
            const rawData: Record[][] = this.rawData;

            const lastDate = rawData[1][rawData[1].length - 1].fecha;
            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const lastMonth = parseInt(lastDate.split("-")[1], 10);
            const months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);
            const years = [lastYear - 1, lastYear];
            const volumes: object[] = [];
            this.title = categories.get(this.type);
            const labels: Labels = {
                "months": months.map((item) => this.MONTHS[item - 1]),
                "years": years
            };
            const fMonth = filters.fMonth;
            if (fMonth !== undefined) {
                labels.months = fMonth.map((item: number) => this.MONTHS[item - 1]);
            }

            years.forEach((value, idx) => {
                const vols: number[] = [];
                months.forEach((month) => {
                    if (fMonth !== undefined && fMonth.indexOf(month) < 0 || rawData[idx].length === 0) {
                        return;
                    }
                    const fmt = `${value}-${month < 10 ? '0' : ''}${month}-01`;
                    const vol =  rawData[idx].filter(item => item.categoria === this.type && item.fecha === fmt)
                                           .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);

                });

                volumes.push(vols);
            });
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: object[]) {
            this.chartData = {
                colors: this.title === "GASOIL" ? 'office.Blue6' : 'office.Orange6',
                labels: labels.months,
                datasets: [{
                    label: labels.years[0],
                    data: volumes[0],
                    lineTension: 0,
                    fill: false
                },
                {
                    label: labels.years[1],
                    data: volumes[1],
                    lineTension: 0,
                    fill: false
                }]
            };
        }
    },
    mounted() {
        this.requestData();
    }
});

const CategoryImportMonths = Vue.extend({
    extends: CategoryMonths,
    computed: {
        categories() {
            return this.$store.getters.getMCategories;
        },
        rawData() {
            return [
                this.$store.getters.getMDataY1,
                this.$store.getters.getMDataY2
            ];
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByMonth").then(this.updateChart).catch(this.onError);
        }
    }
});

const CategorySalesMonths = Vue.extend({
    extends: CategoryMonths,
    data() {
        return {
            year: 2020
        };
    },
    computed: {
        categories() {
            return this.$store.getters["sales/getCategories"];
        },
        rawData() {
            return [
                this.$store.getters["sales/getData"](`sales/by_month/${this.year - 1}`),
                this.$store.getters["sales/getData"](`sales/by_month/${this.year}`)
            ];
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("sales/fetchByName", `by_month/${this.year}`).then(() => {
                this.$store.dispatch("sales/fetchByName", `by_month/${this.year - 1}`)
                            .then(this.updateChart)
                            .catch(this.onError);
            }).catch(this.onError);
        }
    }
});


export { CategoryImportMonths, CategorySalesMonths };