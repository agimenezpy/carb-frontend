import Vue from 'vue';
import Loader from './Loader';
import { PriceMonthsChart, ColorSchemes } from '../charts';
import { FilterUtil, FilterObj, Record, WatchMonth, CardUtil} from './mixins';

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
            <price-months-chart v-if="loaded && !empty" :chart-data="chartData" :styles="styles"></price-months-chart>
        </div>
    </div>
</div>`;

interface Labels {
    [propName: string]: any;
}

const PriceMonths = Vue.extend({
    name: "PriceMonths",
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
                "GL": [schemes.office.Blue6[0], schemes.office.Blue6[1]],
                "GA": [schemes.office.Orange6[1], schemes.office.Orange6[0]]
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
            let rawData: Record[][] = [[], []];

            let lastDate = `${this.year}-12-1`;
            if (this.rawData.length > 1 && this.rawData[0].length > 0 && this.rawData[1].length > 0) {
                rawData = this.rawData;
                lastDate = rawData[1][rawData[1].length - 1].fecha;
            }

            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const lastMonth = parseInt(lastDate.split("-")[1], 10);
            const months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);
            const years = [lastYear - 1, lastYear];
            const volumes: object[] = [];
            this.title = products.get(this.type);
            const labels: Labels = {
                "months": months.map((item) => this.MONTHS[item - 1]),
                "years": years
            };
            const fMonth = filters.fMonth;
            if (fMonth !== undefined && rawData.length > 1 && rawData[0].length === 0 && rawData[1].length === 0) {
                labels.months = fMonth.map((item: number) => this.MONTHS[item - 1]);
            }

            years.forEach((value, idx) => {
                const vols: number[] = [];
                months.forEach((month) => {
                    if (fMonth !== undefined && fMonth.indexOf(month) < 0 || rawData[idx].length === 0) {
                        return;
                    }
                    const fmt = `${value}-${month < 10 ? '0' : ''}${month}-01`;
                    const vol =  rawData[idx].filter(item => item.producto === this.type && item.fecha === fmt)
                                             .reduce((sum, item) => sum + Number(item.volumen), 0.0);
                    vols.push(vol);

                });

                volumes.push(vols);
            });
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: object[]) {
            this.chartData = {
                colors: this.colors[this.type === "GS" ? this.type :
                                    this.title.startsWith("GASOIL") ? "GL" : "GA"],
                labels: labels.months,
                datasets: [{
                    label: labels.years[0],
                    data: volumes[0],
                    lineTension: 0,
                    fill: false
                },
                {
                    label: labels.years[1],
                    data: volumes[1],
                    lineTension: 0,
                    fill: false
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

const PriceImportMonths = Vue.extend({
    extends: PriceMonths,
    computed: {
        products() {
            return this.$store.getters.getPriProducts;
        },
        rawData() {
            return [
                this.$store.getters.getPriDataY1,
                this.$store.getters.getPriDataY2
            ];
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByPrice", this.year)
                        .then(this.updateChart)
                        .catch(this.onError);
        }
    }
});



export { PriceImportMonths };