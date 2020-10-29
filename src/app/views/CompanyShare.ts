import Vue from 'vue';
import Loader from './Loader';
import { CompanyShareChart } from '../charts';
import { FilterObj, FilterUtil, Record, WatchMonth } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header.replace("$title", title)}}</div>
            <Loader v-if="!loaded && !error"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <company-share-chart v-if="loaded" :chart-data="chartData" :title="title" :aspect="aspect" :styles="styles"></company-share-chart>
        </div>
    </div>
</div>`;

const CompanyShare = Vue.extend({
    name: "CompanyShare",
    components: {
        CompanyShareChart, Loader
    },
    mixins: [FilterUtil, WatchMonth],
    template,
    data() {
        return {
            loaded: false,
            error: false,
            chartData: {},
            colors: {
                TOTAL: "brewer.Greys4",
                GL: "brewer.Blues4",
                GA: "brewer.Oranges4"
            },
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
        onError(status: number) {
            this.loaded = false;
            this.error = status > 0;
        },
        updateChart(filters: FilterObj = {}) {
            this.loaded = false;
            const companies: Map<string, string> = this.companies;
            const categories: Map<string, string> = this.categories;
            let rawData: Record[] = this.rawData;

            if (!this.isEmpty(filters)) {
                rawData = this.filterMonthData(filters, rawData);
            }

            let dataset: object[] = [];

            let total = 0;
            companies.forEach((value, key) => {
                const vol = rawData.filter(item => item.distribuidor === key &&
                                 (this.type !== "TOTAL" ? item.categoria === this.type : true))
                                 .reduce((sum, item) => sum + item.volumen, 0);
                if (vol > 0) {
                    value = value.replace("ARCOS Y RODADOS", "&R")
                                 .replace(" ENERGY", "");
                    dataset.push([value, vol]);
                    total = total + vol;
                }
            });
            dataset = dataset.sort((a, b) => a[1] < b[1] ? 1 : (a[1] === b[1]) ? 0 : -1);
            const labels: string[] = dataset.map((item) => (item[0]));
            const volumes: number[] = dataset.map((item) => (item[1]));
            this.title = categories.has(this.type) ? categories.get(this.type) : "Total";
            this.loaded = true;
            this.setChartData(labels, volumes);
        },
        setChartData(labels: string[], volumes: number[]) {
            this.chartData = {
                colors: this.colors[this.type],
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
            this.promise.then(this.updateChart).catch(this.onError);
        }
    },
    computed: {
        companies() {
            return this.$store.getters["sales/getCompanies"];
        },
        categories() {
            return this.$store.getters["sales/getCategories"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("salesm/by_category");
        }
    },
    mounted() {
        this.promise = this.$store.dispatch("sales/fetchByName", "salesm/by_category");
    }
});

export { CompanyShare };