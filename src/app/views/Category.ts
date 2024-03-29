import Vue from 'vue';
import Loader from './Loader';
import { CategoryChart, ColorSchemes } from '../charts';
import { FilterUtil, FilterObj, Record, WatchMonth, WatchComp, CardUtil } from './mixins';


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
            <category-chart v-if="loaded" :chart-data="chartData" :title="title" :aspect="aspect" :styles="styles"></category-chart>
        </div>
    </div>
</div>`;

const Category = Vue.extend({
    name: "Category",
    components: {
        CategoryChart, Loader
    },
    mixins: [FilterUtil, WatchMonth, WatchComp, CardUtil],
    template,
    data() {
        const schemes = ColorSchemes.getColorSchemes();
        return {
            chartData: {},
            colors: {
                "TOTAL": [schemes.office.Blue6[0], schemes.office.Orange6[0]],
                "GL": [schemes.office.Blue6[0], schemes.brewer.Blues6[0]],
                "GA": [schemes.brewer.Oranges6[0], schemes.office.Orange6[0]]
            },
            title: ""
        };
    },
    props: {
        header: String,
        type: String,
        xclass: String,
        aspect: Boolean,
        styles: Object
    },
    methods: {
        updateChart(filters: FilterObj = {fComp: undefined, fMonth: undefined}) {
            this.loaded = false;
            const categories: Map<string, string> = this.categories;
            let rawData: Record[] = this.rawData;

            const labels: string[] = [];
            const volumes: number[] = [];

            if (!this.isEmpty(filters) && rawData.length > 0) {
                rawData = this.filterDualData(filters, rawData);
            }

            categories.forEach((value, key) => {
                const vol = rawData.filter(item => item.categoria === key)
                                 .reduce((sum, item) => sum + item.volumen, 0);
                if (vol > 0) {
                    labels.push(value);
                    volumes.push(vol);
                }
            });

            this.title = (this.type === "TOTAL") ?
                         labels.join(" y ") :
                         categories.get(this.type);
            this.loaded = true;
            this.setChartData(labels, volumes);
        },
        setChartData(labels: string[], volumes: number[]) {
            this.chartData = {
                colors: this.colors[this.type],
                invert: this.type === "TOTAL" ? undefined : this.type === "GA",
                legend: this.type === "TOTAL",
                labels,
                datasets: [{
                        data: volumes
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

const CategoryImport = Vue.extend({
    extends: Category,
    computed: {
        categories() {
            return this.$store.getters["imports/getCategories"];
        },
        rawData() {
            return this.$store.getters["imports/getData"]("import/by_company/" + this.year);
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("imports/fetchByName", "by_company/" + this.year)
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    }
});

const CategorySalesMix = Vue.extend({
    extends: Category,
    computed: {
        categories() {
            return this.$store.getters["sales/getCategories"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("salesm/by_category/" + this.year);
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("sales/fetchByName", "salesm/by_category/" + this.year)
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    }
});

export { CategoryImport, CategorySalesMix };