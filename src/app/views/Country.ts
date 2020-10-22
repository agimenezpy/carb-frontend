import Vue from 'vue';
import Loader from './Loader';
import { CountryChart, ColorSchemes } from './Charts';
import { Record } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header.replace("$title", title)}}</div>
            <Loader v-if="!loaded"/>
            <country-chart v-if="loaded" :chart-data="chartData" :title="title" :aspect="aspect" :styles="styles"></country-chart>
        </div>
    </div>
</div>`;

const Country = Vue.extend({
    name: "Country",
    components: {
        CountryChart, Loader
    },
    template,
    data() {
        return {
            loaded: false,
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
            this.setChartData(labels, volumes);
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
        }
    },
    watch: {
        categories() {
            this.promise.then(this.updateChart);
        }
    },
    computed: {
        countries() {
            return this.$store.getters["imports/getCountries"];
        },
        categories() {
            return this.$store.getters.getCategories;
        },
        rawData() {
            return this.$store.getters["imports/getData"]("import/by_country");
        }
    },
    mounted() {
        const schemes = ColorSchemes.getColorSchemes();
        this.colors = [schemes.office.Blue6, schemes.office.Orange6];
        this.promise = this.$store.dispatch("imports/fetchByName", "by_country");
    }
});

export default Country;