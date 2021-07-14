import Vue from 'vue';
import Loader from './Loader';
import { CountryChart, ColorSchemes } from '../charts';
import { Record, CardUtil } from './mixins';

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
    mixins: [CardUtil],
    template,
    data() {
        return {
            chartData: {},
            colors: [],
            promise: {},
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
        updateChart() {
            this.loaded = false;
            this.empty = false;
            const countries: Map<string, string> = this.countries;
            const categories: Map<string, string> = this.categories;
            const rawData: Record[] = this.rawData;

            const labels: string[] = [];
            const volumes: number[] = [];

            countries.forEach((value, key) => {
                const vol = rawData.filter(item => item.categoria === this.type && item.pais === key)
                                 .reduce((sum, item) => sum + item.volumen, 0);
                if (vol > 0) {
                    labels.push(value);
                    volumes.push(vol);
                }
            });
            this.title = categories.get(this.type);
            this.loaded = true;
            if (volumes.length > 0) {
                this.setChartData(labels, volumes);
            }
            else {
                this.empty = true;
            }
        },
        setChartData(labels: string[], volumes: number[]) {
            this.chartData = {
                colors: this.title === "GASOIL" ? this.colors[0] : this.colors[1],
                invert: this.title !== "GASOIL",
                labels,
                datasets: [
                    {
                        data: volumes
                    }
                ]
            };
        },
        requestData() {
            this.$store.dispatch("imports/fetchByName", "by_country/" + this.year)
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    },
    watch: {
        categories() {
            if (this.year > 0) {
                this.requestData();
            }
        },
        year() {
            this.requestData();
        }
    },
    computed: {
        year() {
            return this.$store.getters.getYear;
        },
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
    mounted() {
        const schemes = ColorSchemes.getColorSchemes();
        this.colors = [schemes.office.Blue6, schemes.office.Orange6];
    }
});

export default Country;