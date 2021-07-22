import Vue from 'vue';
import { CategoryBarTimeChart } from '../charts';
import { FilterUtil, FilterObj, Record, WatchMonth, WatchComp, CardUtil, WatchCntry } from './mixins';
import Loader from './Loader';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header.replace("$year", title)}}</div>
            <Loader v-if="!loaded && !error && !empty"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <div class="alert alert-yellow modifier-class is-active" v-if="empty">
                Sin datos
            </div>
            <category-bar-time-chart v-if="loaded" :chart-data="chartData" :styles="styles" ></category-bar-time-chart>
        </div>
    </div>
</div>`;

interface Labels {
    [propName: string]: string[];
}

const CategoryBarTime = Vue.extend({
    name: "CategoryBarTime",
    components: {
        CategoryBarTimeChart, Loader
    },
    mixins: [FilterUtil, CardUtil],
    template,
    data() {
        return {
            chartData: {},
            title: ""
        };
    },
    props: {
        header: String,
        xclass: String,
        styles: Object,
        type: String
    },
    methods: {
        updateChart(filters: FilterObj = {}) {
            this.loaded = false;
            const categories: Map<string, string> = this.categories;
            let rawData: Record[] = [];

            let lastDate = `${this.year}-12-1`;
            if (this.rawData.length > 0) {
                rawData = this.rawData;
                lastDate = rawData[rawData.length - 1].fecha;
            }

            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const lastMonth = parseInt(lastDate.split("-")[1], 10);


            const labels: Labels = {
                "months": [],
                "categories": [categories.get(this.type) + ""]
            };
            const volumes: object[] = [];
            const fMonth = filters.fMonth;

            if (!this.isEmpty(filters) && rawData.length > 0) {
                rawData = this.filterData(filters, rawData);
            }

            let maxMonth = 0;
            const months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);

            const vols: number[] = [];
            months.forEach((month) => {
                if (fMonth !== undefined && fMonth.indexOf(month) < 0 || rawData.length === 0) {
                    return;
                }
                const fmt = `${lastYear}-${month < 10 ? '0' : ''}${month}-01`;
                const vol =  rawData.filter(item => item.categoria === this.type && item.fecha === fmt)
                                    .reduce((sum, item) => sum + item.volumen, 0);
                vols.push(vol);
                if (labels.months.length < months.length && month > maxMonth) {
                    labels.months.push(this.MONTHS[month - 1]);
                    maxMonth = month;
                }

                volumes.push(vols);
            });
            this.setChartData(`${lastYear}`, labels, volumes);
            this.loaded = true;
        },
        setChartData(title: string, labels: Labels, volumes: object[]) {
            this.title = title;
            this.chartData = {
                labels: labels.months,
                showLabels: true,
                showTicks: this.showTicks || false,
                largeTicks: true,
                labelRotation: 0,
                xLabelRotation: 0,
                datasets: [{
                    label: labels.categories[0],
                    data: volumes[0],
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

const CategoryImportGasTime = Vue.extend({
    extends: CategoryBarTime,
    mixins: [WatchMonth, WatchComp, WatchCntry],
    computed: {
        categories() {
            return this.$store.getters["imports/getCategories"];
        },
        rawData() {
            return this.$store.getters["imports/getData"]("import/gas/by_category/" + this.year);
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("imports/fetchByName", "gas/by_category/" + this.year)
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    }
});

const CategorySalesGasTime = Vue.extend({
    extends: CategoryBarTime,
    mixins: [WatchMonth, WatchComp],
    data() {
        return {
            showTicks: true
        };
    },
    computed: {
        categories() {
            return this.$store.getters["sales/getCategories"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("sales/gas/by_category/" + this.year);
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("sales/fetchByName", "gas/by_category/" + this.year)
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    }
});

export {
    CategoryImportGasTime, CategorySalesGasTime
};