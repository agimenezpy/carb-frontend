import Vue from 'vue';
import Loader from './Loader';
import { CategoryMonthsChart, ColorSchemes } from '../charts';
import { FilterUtil, FilterObj, Record, WatchMonth, CardUtil } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header.replace("$title", title)}}</div>
            <Loader v-if="!loaded && !error && !empty"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <div class="alert alert-yellow modifier-class is-active" v-if="empty">
                Sin datos
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
    mixins: [FilterUtil, WatchMonth, CardUtil],
    template,
    data() {
        const schemes = ColorSchemes.getColorSchemes();
        return {
            title: "",
            chartData: {},
            colors: {
                "GS": [schemes.office.Blue6[0], schemes.office.Orange6[0]],
                "GL": [schemes.office.Blue6[0], schemes.office.Blue6[1]],
                "GA": [schemes.office.Orange6[1], schemes.office.Orange6[0]]
            }
        };
    },
    props: {
        header: String,
        type: String,
        xclass: String,
        styles: Object
    },
    methods: {
        updateChart(filters: FilterObj = {}) {
            this.loaded = false;
            const categories: Map<string, string> = this.categories;
            let rawData: Record[][] = [[], []];

            let lastDate = `${this.year}-12-1`;
            if (this.rawData.length > 1 && this.rawData[0].length > 0 && this.rawData[1].length > 0) {
                rawData = this.rawData;
                lastDate = rawData[1][rawData[1].length - 1].fecha;
            }

            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const lastMonth = parseInt(lastDate.split("-")[1], 10);
            const months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);
            const years = [lastYear - 1, lastYear];
            const volumes: object[] = [];
            const title = categories.get(this.type);
            const labels: Labels = {
                "months": months.map((item) => this.MONTHS[item - 1]),
                "years": years
            };
            const fMonth = filters.fMonth;
            if (fMonth !== undefined && rawData[0].length > 0 && rawData[1].length > 0) {
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
            this.setChartData(`${title} ${lastYear - 1} vs ${lastYear}`, labels, volumes);
            this.loaded = true;
        },
        setChartData(title: string, labels: Labels, volumes: object[]) {
            this.title = title;
            this.chartData = {
                colors: this.colors[this.type],
                div: this.type === "GS" ? 1 : false,
                showLabels: this.type === "GS",
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
    watch: {
        year() {
            this.requestData();
        }
    },
    computed: {
        year() {
            return this.$store.getters.getYear;
        }
    },
    mounted() {
        if (this.year > 0) {
            this.requestData();
        }
    }
});

const CategoryImportMonths = Vue.extend({
    extends: CategoryMonths,
    computed: {
        categories() {
            return this.$store.getters["imports/getCategories"];
        },
        rawData() {
            return [
                this.$store.getters["imports/getData"](`import/by_month/${this.year - 1}`),
                this.$store.getters["imports/getData"](`import/by_month/${this.year}`)
            ];
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("imports/fetchByName", `by_month/${this.year}`).then(() => {
                this.$store.dispatch("imports/fetchByName", `by_month/${this.year - 1}`)
                            .then(this.updateChart)
                            .catch(this.onError);
            }).catch(this.onError);
        }
    }
});

const CategorySalesMonths = Vue.extend({
    extends: CategoryMonths,
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

const CategorySalesMMonths = Vue.extend({
    extends: CategoryMonths,
    computed: {
        categories() {
            return this.$store.getters["sales/getCategories"];
        },
        rawData() {
            return [
                this.$store.getters["sales/getData"](`salesm/by_month/${this.year - 1}`),
                this.$store.getters["sales/getData"](`salesm/by_month/${this.year}`)
            ];
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("sales/fetchByName", `salesm/by_month/${this.year}`).then(() => {
                this.$store.dispatch("sales/fetchByName", `salesm/by_month/${this.year - 1}`)
                            .then(this.updateChart)
                            .catch(this.onError);
            }).catch(this.onError);
        }
    }
});


const CategoryImportGasMonths = Vue.extend({
    extends: CategoryMonths,
    computed: {
        categories() {
            return this.$store.getters["imports/getCategories"];
        },
        rawData() {
            return [
                this.$store.getters["imports/getData"](`import/gas/by_month/${this.year - 1}`),
                this.$store.getters["imports/getData"](`import/gas/by_month/${this.year}`)
            ];
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("imports/fetchByName", `gas/by_month/${this.year}`).then(() => {
                this.$store.dispatch("imports/fetchByName", `gas/by_month/${this.year - 1}`)
                            .then(this.updateChart)
                            .catch(this.onError);
            }).catch(this.onError);
        }
    }
});

export { CategoryImportMonths, CategorySalesMonths, CategorySalesMMonths,
         CategoryImportGasMonths };