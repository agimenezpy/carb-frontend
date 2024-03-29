import Vue from 'vue';
import { ProductChart, ColorSchemes } from '../charts';
import Loader from './Loader';
import { FilterUtil, FilterObj, Record, WatchMonth, WatchComp, WatchDepto, CardUtil} from './mixins';

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
            <product-chart v-if="loaded" :chart-data="chartData" :aspect="aspect" :styles="styles"></product-chart>
        </div>
    </div>
</div>`;

const Product = Vue.extend({
    name: "Product",
    components: {
        ProductChart, Loader
    },
    mixins: [FilterUtil, CardUtil],
    template,
    data() {
        return {
            chartData: {},
            colors: [],
            div: 1,
            split: false
        };
    },
    props: {
        header: String,
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
            if (this.split) {
                this.chartData = {
                    div: this.div, // division entre millones?
                    labels: ["Producto"],
                    legend: true,
                    datasets: labels.map((item: any, idx: number) => (
                        {
                            label: [labels[idx]],
                            backgroundColor: this.colors[idx],
                            data: [volumes[idx]]
                        })
                    )
                };
            }
            else {
                this.chartData = {
                    labels,
                    div: this.div, // division entre millones?
                    datasets: [
                        {
                            backgroundColor: this.colors,
                            data: volumes
                        }
                    ]
                };
            }
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
        const schm = ColorSchemes.getColorSchemes();
        this.colors = schm.office.Blue6.slice(0, 2).concat(schm.office.Orange6);

        if (this.year > 0) {
            this.requestData();
        }
    }
});

const ProductImport = Vue.extend({
    extends: Product,
    mixins: [WatchMonth, WatchComp],
    methods: {
        doFilter(filters: FilterObj, rawData: Record[]) {
            return this.filterDualData(filters, rawData);
        },
        requestData() {
            this.$store.dispatch("imports/fetchByName", "by_product/" + this.year)
            .then(this.updateChart)
            .catch(this.onError);
        }
    },
    computed: {
        products() {
            return this.$store.getters["imports/getProducts"];
        },
        rawData() {
            return this.$store.getters["imports/getData"]("import/by_product/" + this.year);
        }
    }
});

const ProductSales = Vue.extend({
    extends: Product,
    mixins: [WatchMonth, WatchComp, WatchDepto],
    methods: {
        doFilter(filters: FilterObj, rawData: Record[]) {
            return this.filterData(filters, rawData);
        },
        requestData() {
            this.$store.dispatch("sales/fetchByName", "by_product/" + this.year)
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    },
    computed: {
        products() {
            return this.$store.getters["sales/getProducts"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("sales/by_product/" + this.year);
        }
    }
});

const ProductSalesMix = Vue.extend({
    extends: Product,
    mixins: [WatchMonth, WatchComp],
    data() {
        return {
            div: 1e6,
            split: true
        };
    },
    methods: {
        doFilter(filters: FilterObj, rawData: Record[]) {
            return this.filterDualData(filters, rawData);
        },
        requestData() {
            this.$store.dispatch("sales/fetchByName", "salesm/by_product/" + this.year)
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    },
    computed: {
        products() {
            return this.$store.getters["sales/getProducts"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("salesm/by_product/" + this.year);
        }
    }
});

export { ProductSales, ProductImport, ProductSalesMix};