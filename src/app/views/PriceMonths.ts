import Vue from 'vue';
import Loader from './Loader';
import { PriceMonthsChart  } from './Charts';
import { FilterUtil, FilterObj, Record, WatchMonth } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header.replace("$title", title)}}</div>
            <Loader v-if="!loaded && !error"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <price-months-chart v-if="loaded" :chart-data="chartData" :styles="styles"></price-months-chart>
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
    mixins: [FilterUtil, WatchMonth],
    template,
    data() {
        return {
            loaded: false,
            title: "",
            chartData: {},
            error: false
        };
    },
    props: {
        header: String,
        type: String,
        xclass: String,
        styles: Object
    },
    methods: {
        onError(status: number) {
            this.loaded = false;
            this.error = status > 0;
        },
        updateChart(filters: FilterObj = {}) {
            this.loaded = false;
            const products: Map<string, string> = this.products;
            const rawData: Record[][] = this.rawData;

            const lastDate = rawData[1][rawData[1].length - 1].fecha;
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
            if (fMonth !== undefined) {
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
                                           .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);

                });

                volumes.push(vols);
            });
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: object[]) {
            this.chartData = {
                colors: this.title.startsWith("GASOIL") ? 'office.Blue6' : 'office.Orange6',
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
    mounted() {
        this.requestData();
    }
});

const PriceImportMonths = Vue.extend({
    extends: PriceMonths,
    data() {
        return {
            year: 2020
        };
    },
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
            this.$store.dispatch("fetchByPrice", this.year).then(this.updateChart).catch(this.onError);
        }
    }
});



export { PriceImportMonths };