import Vue from 'vue';
import { CountryChart, ColorSchemes } from '../charts';
import Loader from './Loader';
import { FilterUtil, FilterObj, Record, WatchMonth, WatchComp, CardUtil, WatchCntry} from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class="card-content">
            <div class="font-size--3">{{header}}</div>
            <Loader v-if="!loaded && !error && !empty"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <div class="alert alert-yellow modifier-class is-active" v-if="empty">
                Sin datos
            </div>
            <country-chart v-if="loaded" :chart-data="chartData" :aspect="aspect" :styles="styles"></country-chart>
        </div>
    </div>
</div>`;

const ProductPie = Vue.extend({
    name: "ProductPie",
    components: {
        CountryChart, Loader
    },
    mixins: [FilterUtil, CardUtil],
    template,
    data() {
        const schemes = ColorSchemes.getColorSchemes();
        return {
            chartData: {},
            colors: {
                "GS": schemes.office.Office6
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
            const products: Map<string, string> = this.products;
            let rawData: Record[] = this.rawData;

            const labels: string[] = [];
            const volumes: number[] = [];

            if (!this.isEmpty(filters) && rawData.length > 0) {
                rawData = this.filterData(filters, rawData);
            }

            const colors: string[] = [];

            products.forEach((value, key) => {
                const qs = rawData.filter(item => item.producto === key);

                const vol = qs.reduce((sum, item) => sum + item.volumen, 0);

                if (vol > 0) {
                    labels.push(value);
                    volumes.push(vol);
                }
            });
            this.setChartData(labels, volumes, colors);
            this.loaded = true;
        },
        setChartData(labels: string[], volumes: number[], colors: string[]) {
            this.chartData = {
                colors: this.colors[this.type],
                rotate: -0.5 * Math.PI,
                color: "white",
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

const ProductImportGas = Vue.extend({
    extends: ProductPie,
    mixins: [WatchMonth, WatchComp, WatchCntry],
    computed: {
        products() {
            return this.$store.getters["imports/getProducts"];
        },
        rawData() {
            return this.$store.getters["imports/getData"]("import/gas/by_product/" + this.year);
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("imports/fetchByName", "gas/by_product/" + this.year)
                        .then(this.updateChart)
                        .catch(this.onError);
        }
    }
});


export { ProductImportGas };