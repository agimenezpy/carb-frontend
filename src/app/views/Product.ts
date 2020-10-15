import Vue from 'vue';
import { ProductChart, ColorSchemes } from './Charts';
import Loader from './Loader';
import { FilterUtil, FilterObj, Record, WatchMonth, WatchComp, WatchDepto} from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class="card-content">
            <h5>{{header}}</h5>
            <Loader v-if="!loaded"/>
            <product-chart v-if="loaded" :chart-data="chartData" :aspect="aspect"></product-chart>
        </div>
    </div>
</div>`;

const Product = Vue.extend({
    name: "Product",
    components: {
        ProductChart, Loader
    },
    mixins: [FilterUtil, WatchMonth, WatchComp, WatchDepto],
    template,
    data() {
        return {
            loaded: false,
            chartData: {},
            colors: []
        };
    },
    props: {
        header: String,
        xclass: String,
        aspect: {
            type: Boolean,
            default: true,
            required: false
        }
    },
    methods: {
        updateChart(filters: FilterObj = {}) {
            this.loaded = false;
            const products: Map<string, string> = this.products;
            let rawData: Record[] = this.rawData;

            const labels: string[] = [];
            const volumes: number[] = [];

            if (!this.isEmpty(filters)) {
                rawData = this.doFilter(filters, rawData);
            }

            products.forEach((value, key) => {
                const qs = rawData.filter(item => item.producto === key);

                const vol = qs.reduce((sum, item) => sum + item.volumen, 0);
                if (vol > 0) {
                    labels.push(value);
                    volumes.push(vol);
                }
            });
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: string[], volumes: number[]) {
            this.chartData = {
                labels,
                datasets: [
                    {
                        backgroundColor: this.colors,
                        data: volumes
                    }
                ]
            };
        }
    },
    mounted() {
        const schm = ColorSchemes.getColorSchemes();
        this.colors = schm.office.Blue6.slice(0, 2).concat(schm.office.Orange6);
    }
});

const ProductImport = Vue.extend({
    extends: Product,
    mixins: [WatchMonth, WatchComp],
    methods: {
        doFilter(filters: FilterObj, rawData: Record[]) {
            return this.filterDualData(filters, rawData);
        }
    },
    computed: {
        products() {
            return this.$store.getters.getProducts;
        },
        rawData() {
            return this.$store.getters.getProdData;
        }
    },
    mounted() {
        this.$store.dispatch("fetchByProduct").then(this.updateChart);
    }
});

const ProductSales = Vue.extend({
    extends: Product,
    mixins: [WatchMonth, WatchComp, WatchDepto],
    methods: {
        doFilter(filters: FilterObj, rawData: Record[]) {
            return this.filterData(filters, rawData);
        }
    },
    computed: {
        products() {
            return this.$store.getters["sales/getProducts"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("sales/by_product");
        }
    },
    mounted() {
        this.$store.dispatch("sales/fetchByName", "by_product").then(this.updateChart);
    }
});

export { ProductSales, ProductImport };