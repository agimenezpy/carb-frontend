import Vue from 'vue';
import Loader from './Loader';
import { ProductsMixChart } from '../charts';
import { FilterObj, FilterUtil, Record, WatchComp, WatchMonth } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header}}</div>
            <Loader v-if="!loaded && !error"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <products-mix-chart v-if="loaded" :chart-data="chartData" :aspect="aspect" :styles="styles"></products-mix-chart>
        </div>
    </div>
</div>`;

interface Labels {
    companies: string[];
    products: string[];
}

const CompanyMixer = Vue.extend({
    name: "CompanyMixer",
    components: {
        ProductsMixChart, Loader
    },
    mixins: [FilterUtil, WatchComp, WatchMonth],
    template,
    data() {
        return {
            loaded: false,
            error: false,
            chartData: {},
            promise: {},
            colors: []
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
            const companies: Map<number, string> = this.companies;
            const products: Map<string, string> = this.products;
            let rawData: Record[] = this.rawData;

            if (!this.isEmpty(filters)) {
                rawData = this.filterDualData(filters, rawData);
            }

            let dataset: object[] = [];

            companies.forEach((value, key) => {
                const vols: number[] = [];
                let total: number = 0;
                products.forEach((prd, prdKey) => {
                    const vol =  rawData.filter(item => item.distribuidor === key &&
                                                item.producto === prdKey)
                                        .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);
                    total += vol;
                });
                if (total > 0) {
                    dataset.push([value, vols, total]);
                }
            });
            dataset = dataset.sort((a, b) => a[2] < b[2] ? 1 : (a[2] === b[2]) ? 0 : -1);
            const labels: Labels = {
                companies: dataset.map((item) => (item[0])),
                products: Array.from(products).map(item => (item[1]))
            };
            const volumes: number[][] = dataset.map((item) => (item[1]));
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: number[]) {
            const datasets: object[] = [];
            labels.products.forEach((value: string, idx: number) => {
                const total: number = volumes.reduce((sum: number, item: number) => (item[idx]), 0);
                if (total > 0) {
                    datasets.push({
                        label: labels.products[idx],
                        data: volumes.map((item: any) => (item[idx]))
                    });
                }
            });
            this.chartData = {
                labels: labels.companies,
                datasets
            };
        }
    },
    watch: {
        companies() {
            this.promise.then(this.updateChart)
                        .catch(this.onError);
        }
    },
    computed: {
        companies() {
            return this.$store.getters["sales/getCompanies"];
        },
        products() {
            return this.$store.getters["sales/getProducts"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("salesm/by_product");
        }
    },
    mounted() {
        this.promise = this.$store.dispatch("sales/fetchByName", "salesm/by_product");
    }
});

export { CompanyMixer };