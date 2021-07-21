import Vue from 'vue';
import Loader from './Loader';
import { CountryChart, ColorSchemes } from '../charts';
import { Record, CardUtil, FilterObj, FilterUtil, WatchMonth, WatchComp, WatchCntry} from './mixins';


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
            <country-chart v-if="loaded && !empty" :chart-data="chartData" :title="title" :aspect="aspect" :styles="styles"></country-chart>
        </div>
    </div>
</div>`;

const Country = Vue.extend({
    name: "Country",
    components: {
        CountryChart, Loader
    },
    mixins: [CardUtil, FilterUtil],
    template,
    data() {
        const schemes = ColorSchemes.getColorSchemes();
        return {
            chartData: {},
            colors: {
                "GL": schemes.office.Blue6,
                "GA": schemes.office.Orange6,
                "GS": [schemes.brewer.BuGn3[1], schemes.brewer.BuGn3[2], schemes.brewer.BuGn3[0]]
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
        updateChart(filters: FilterObj = {}) {
            this.loaded = false;
            const countries: Map<string, string> = this.countries;
            const categories: Map<string, string> = this.categories;
            let rawData: Record[] = this.rawData;

            const labels: string[] = [];
            const volumes: number[] = [];

            if (!this.isEmpty(filters) && rawData.length > 0) {
                rawData = this.filterData(filters, rawData);
            }

            countries.forEach((value, key) => {
                const vol = rawData.filter(item => item.categoria === this.type && item.pais === key)
                                 .reduce((sum, item) => sum + item.volumen, 0);
                if (vol > 0) {
                    labels.push(value);
                    volumes.push(vol);
                }
            });
            this.title = categories.get(this.type);
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: string[], volumes: number[]) {
            this.chartData = {
                colors: this.colors[this.type],
                color: this.type === "GS" ? "white" : "#444444",
                labels,
                datasets: [
                    {
                        data: volumes
                    }
                ]
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

const CountryImport = Vue.extend({
    name: "CountryImport",
    extends: Country,
    computed: {
        countries() {
            return this.$store.getters["imports/getCountries"];
        },
        categories() {
            return this.$store.getters["imports/getCategories"];
        },
        rawData() {
            return this.$store.getters["imports/getData"]("import/by_country/" + this.year);
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("imports/fetchByName", "by_country/" + this.year)
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    }
});

const CountryImportGas = Vue.extend({
    name: "CountryImportGas",
    extends: Country,
    mixins: [WatchMonth, WatchComp, WatchCntry],
    computed: {
        countries() {
            return this.$store.getters["imports/getCountries"];
        },
        categories() {
            return this.$store.getters["imports/getCategories"];
        },
        rawData() {
            return this.$store.getters["imports/getData"]("import/gas/by_category/" + this.year);
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("imports/fetchByName", "gas/by_category/" + this.year)
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    }
});

export { CountryImport, CountryImportGas };