import Vue from 'vue';
import { CompanyChart } from './Charts';
import Loader from './Loader';
import { FilterUtil, FilterObj, Record, WatchComp, WatchMonth, WatchDepto } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class="card-content">
            <span class="font-size--3">{{header}}</span>
            <Loader v-if="!loaded"/>
            <company-chart v-if="loaded" :chart-data="chartData" :styles="styles"></company-chart>
        </div>
    </div>
</div>`;

interface Labels {
    companies: string[];
    categories: string[];
}

const Company = Vue.extend({
    name: "Company",
    components: {
        CompanyChart, Loader
    },
    mixins: [FilterUtil],
    template,
    data() {
        return {
            loaded: false,
            chartData: {}
        };
    },
    props: {
        header: String,
        xclass: String,
        styles: Object
    },
    methods: {
        updateChart(filters: FilterObj = {}){
            this.loaded = false;
            const companies: Map<number, string> = this.companies;
            const category: Map<string, string> = this.categories;
            let rawData: Record[] = this.rawData;
            const fComp = filters.fComp;

            const labels: Labels = {
                "companies": new Array<string>(),
                "categories": Array.from(category).map(item => (item[1]))
            };

            if (!this.isEmpty(filters)) {
                rawData = this.filterData(filters, rawData);
            }

            let dataset: object[] = [];
            companies.forEach((value, key) => {
                const vols: number[] = [];
                let total: number = 0;
                if (fComp !== undefined && fComp.indexOf(key) < 0 || rawData.length === 0) {
                    return;
                }
                category.forEach((cat, catkey) => {
                    const vol =  rawData.filter(item => item.distribuidor === key && item.categoria === catkey)
                                        .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);
                    total += vol;
                });
                if (total > 0) {
                    dataset.push([value, vols, total]);
                }
            });
            dataset = dataset.sort((a, b) => a[2] < b[2] ? 1 : (a[2] === b[2]) ? 0 : -1);
            labels.companies = dataset.map((item) => (item[0]));
            const volumes: number[][] = dataset.map((item) => (item[1]));
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: object[]) {
            this.chartData = {
                labels: labels.companies,
                datasets: [{
                    label: labels.categories[0],
                    data: volumes.map((item: any) => (item[0]))
                },
                {
                    label: labels.categories[1],
                    data: volumes.map((item: any) => (item[1]))
                }]
            };
        }
    },
    mounted() {
        this.requestData();
    }
});

const CompanyImport = Vue.extend({
    extends: Company,
    mixins: [WatchComp, WatchMonth],
    computed: {
        companies() {
            return this.$store.getters.getCompanies;
        },
        categories() {
            return this.$store.getters.getCategories;
        },
        rawData() {
            return this.$store.getters.getComData;
        }
    },
    methods: {
        doFilter(filters: FilterObj, rawData: Record[]) {
            return this.filterMonthData(filters, rawData);
        },
        requestData() {
            this.$store.dispatch("fetchByCompany").then(this.updateChart);
        }
    }
});

const CompanySales = Vue.extend({
    extends: Company,
    mixins: [WatchComp, WatchMonth, WatchDepto],
    computed: {
        companies() {
            return this.$store.getters["sales/getCompanies"];
        },
        categories() {
            return this.$store.getters["sales/getCategories"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("sales/by_category");
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("sales/fetchByName", "by_category").then(this.updateChart);
        }
    }
});

export { CompanyImport, CompanySales };