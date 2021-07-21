import Vue from 'vue';
import { CompanyBarChart } from '../charts';
import Loader from './Loader';
import { FilterUtil, FilterObj, Record, WatchComp, WatchMonth, CardUtil, WatchCntry } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class="card-content">
            <span class="font-size--3">{{header}}</span>
            <Loader v-if="!loaded && !error && !empty"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <div class="alert alert-yellow modifier-class is-active" v-if="empty">
                Sin datos
            </div>
            <company-bar-chart v-if="loaded" :chart-data="chartData" :styles="styles"></company-bar-chart>
        </div>
    </div>
</div>`;

const CompanyBar = Vue.extend({
    name: "CompanyBar",
    components: {
        CompanyBarChart, Loader
    },
    mixins: [FilterUtil, CardUtil],
    template,
    data() {
        return {
            chartData: {}
        };
    },
    props: {
        header: String,
        xclass: String,
        styles: Object,
        type: String
    },
    methods: {
        updateChart(filters: FilterObj = {}){
            this.loaded = false;
            const companies: Map<number, string> = this.companies;
            let rawData: Record[] = [];
            const fComp = filters.fComp;

            if (this.rawData.length > 0) {
                rawData = this.rawData;
            }


            if (!this.isEmpty(filters) && rawData.length > 0) {
                rawData = this.filterData(filters, rawData);
            }

            let dataset: object[] = [];
            companies.forEach((value, key) => {

                if (fComp !== undefined && fComp.indexOf(key) < 0 || rawData.length === 0) {
                    return;
                }

                const total =  rawData.filter(item => item.distribuidor === key && item.categoria === this.type)
                                    .reduce((sum, item) => sum + item.volumen, 0);

                if (total > 0) {
                    dataset.push([value, total]);
                }
            });
            dataset = dataset.sort((a, b) => a[1] < b[1] ? 1 : (a[1] === b[1]) ? 0 : -1);
            const labels = dataset.map((item) => (item[0]));
            const volumes: number[] = dataset.map((item) => (item[1]));
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: string[], volumes: object[]) {
            this.chartData = {
                labels,
                showLabels: true,
                datasets: [{
                    label: this.type,
                    data: volumes
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

const CompanyImportGas = Vue.extend({
    extends: CompanyBar,
    mixins: [WatchComp, WatchMonth, WatchCntry],
    computed: {
        companies() {
            return this.$store.getters["imports/getCompanies"];
        },
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

export { CompanyImportGas };