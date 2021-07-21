import Vue from 'vue';
import Loader from './Loader';
import { PriceMonthsChart, ColorSchemes } from '../charts';
import { FilterUtil, FilterObj, Record, WatchMonth, CardUtil} from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header}}</div>
            <Loader v-if="!loaded && !error && !empty"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <div class="alert alert-yellow modifier-class is-active" v-if="empty">
                Sin datos
            </div>
            <price-months-chart v-if="loaded && !empty" :chart-data="chartData" :styles="styles"></price-months-chart>
        </div>
    </div>
</div>`;

interface Labels {
    [propName: string]: any;
}

const ProductPriceMonth = Vue.extend({
    name: "ProductPriceMonth",
    components: {
        PriceMonthsChart, Loader
    },
    mixins: [FilterUtil, WatchMonth, CardUtil],
    template,
    data() {
        const schemes = ColorSchemes.getColorSchemes();
        return {
            title: "",
            chartData: {},
            colors: {
                "GS": schemes.office.Office6,
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
            const products: Map<string, string> = this.products;
            let rawData: Record[] = [];

            let lastDate = `${this.year}-12-1`;
            if (this.rawData.length > 1) {
                rawData = this.rawData;
                lastDate = rawData[rawData.length - 1].fecha;
            }

            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const lastMonth = parseInt(lastDate.split("-")[1], 10);
            const months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);
            const volumes: number[][] = [];
            const labels: Labels = {
                "months": months.map((item) => this.MONTHS[item - 1]),
                "products": Array.from(this.products.values())
            };
            const fMonth = filters.fMonth;
            if (fMonth !== undefined && rawData.length > 1 && rawData[0].length === 0 && rawData[1].length === 0) {
                labels.months = fMonth.map((item: number) => this.MONTHS[item - 1]);
            }

            products.forEach((value, key) => {
                const vols: number[] = [];
                let sums = 0;
                months.forEach((month) => {
                    if (fMonth !== undefined && fMonth.indexOf(month) < 0) {
                        return;
                    }
                    const fmt = `${lastYear}-${month < 10 ? '0' : ''}${month}-01`;
                    const vol =  rawData.filter(item => item.producto === key && item.fecha === fmt)
                                        .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);
                    sums += vol;
                });

                if (sums > 0) {
                    volumes.push(vols);
                }
            });
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: object[]) {
            this.chartData = {
                colors: this.colors[this.type],
                labels: labels.months,
                datasets: volumes.map((item, idx) => {
                    return {
                        label: labels.products[idx],
                        data: item,
                        lineTension: 0,
                        fill: false
                    };
                })
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

const PriceImportGasMonths = Vue.extend({
    extends: ProductPriceMonth,
    computed: {
        products() {
            return this.$store.getters["imports/getProducts"];
        },
        rawData() {
            return this.$store.getters["imports/getData"]("import/gas/by_price/" + this.year);
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("imports/fetchByName", "gas/by_price/" + this.year)
                        .then(this.updateChart)
                        .catch(this.onError);
        }
    }
});



export { PriceImportGasMonths };