import Vue from 'vue';
import { CompanyChart } from './Charts';
import Loader from './Loader';
import { FilterUtil, FilterObj, Record, WatchComp, WatchMonth, WatchDepto } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class="card-content">
            <div class="font-size--3">{{header}}</div>
            <Loader v-if="!loaded && !error"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <company-chart v-if="loaded" :chart-data="chartData"></company-chart>
        </div>
    </div>
</div>`;

interface Labels {
    departaments: string[];
    categories: string[];
}

const Department = Vue.extend({
    name: "Deparment",
    components: {
        CompanyChart, Loader
    },
    mixins: [FilterUtil],
    template,
    data() {
        return {
            loaded: false,
            chartData: {},
            error: false
        };
    },
    props: {
        header: String,
        xclass: String
    },
    methods: {
        onError(status: number) {
            this.error = status > 0;
        },
        updateChart(filters: FilterObj = {}){
            this.loaded = false;
            const departments: Map<string, string> = this.departments;
            const category: Map<string, string> = this.categories;
            let rawData: Record[] = this.rawData;
            const fDepto = filters.fDepto;

            const labels: Labels = {
                "departaments": new Array<string>(),
                "categories": Array.from(category).map(item => (item[1]))
            };

            if (!this.isEmpty(filters)) {
                rawData = this.filterData(filters, rawData);
            }

            let dataset: object[] = [];
            departments.forEach((value, key) => {
                const vols: number[] = [];
                let total: number = 0;
                if (fDepto !== undefined && fDepto.indexOf(key) < 0 || rawData.length === 0) {
                    return;
                }
                category.forEach((cat, catkey) => {
                    const vol =  rawData.filter(item => item.departamento === key && item.categoria === catkey)
                                        .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);
                    total += vol;
                });
                if (total > 0) {
                    dataset.push([value, vols, total]);
                }
            });
            dataset = dataset.sort((a, b) => a[2] < b[2] ? 1 : (a[2] === b[2]) ? 0 : -1);
            labels.departaments = dataset.map((item) => (item[0]));
            const volumes: number[][] = dataset.map((item) => (item[1]));
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: object[]) {
            this.chartData = {
                labels: labels.departaments,
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

const DepartmentSales = Vue.extend({
    extends: Department,
    mixins: [WatchComp, WatchMonth, WatchDepto],
    computed: {
        departments() {
            return this.$store.getters["sales/getDepartments"];
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
            this.$store.dispatch("sales/fetchByName", "by_category")
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    }
});


export { DepartmentSales };