import Vue from 'vue';
import { CategoryTimeChart } from '../charts';
import { FilterUtil, FilterObj, Record, WatchMonth, WatchComp, WatchDepto } from './mixins';
import Loader from './Loader';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header.replace("$year", title)}}</div>
            <Loader v-if="!loaded && !error"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <category-time-chart v-if="loaded" :chart-data="chartData" :styles="styles" :amountType="amountType"></category-time-chart>
        </div>
    </div>
</div>`;

interface Labels {
    [propName: string]: string[];
}

const CategoryTime = Vue.extend({
    name: "CategoryTime",
    components: {
        CategoryTimeChart, Loader
    },
    mixins: [FilterUtil],
    template,
    data() {
        return {
            loaded: false,
            chartData: {},
            title: "",
            error: false,
            amountType: ""
        };
    },
    props: {
        header: String,
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
            const categories: Map<string, string> = this.categories;
            let rawData: Record[] = this.rawData;
            const lastDate = rawData[rawData.length - 1].fecha;
            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const lastMonth = parseInt(lastDate.split("-")[1], 10);

            const labels: Labels = {
                "months": [],
                "categories": Array.from(categories).map(item => (item[1]))
            };
            const volumes: object[] = [];
            const fMonth = filters.fMonth;

            if (!this.isEmpty(filters)) {
                rawData = this.filterData(filters, rawData);
            }

            let maxMonth = 0;
            const months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);
            categories.forEach((value, key) => {
                const vols: number[] = [];
                months.forEach((month) => {
                    if (fMonth !== undefined && fMonth.indexOf(month) < 0 || rawData.length === 0) {
                        return;
                    }
                    const fmt = `${lastYear}-${month < 10 ? '0' : ''}${month}-01`;
                    const vol =  rawData.filter(item => item.categoria === key && item.fecha === fmt)
                                      .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);
                    if (labels.months.length < months.length && month > maxMonth) {
                        labels.months.push(this.MONTHS[month - 1]);
                        maxMonth = month;
                    }
                });

                volumes.push(vols);
            });
            this.setChartData(`${lastYear}`, labels, volumes);
            this.loaded = true;
        },
        setChartData(title: string, labels: Labels, volumes: object[]) {
            this.title = title;
            this.chartData = {
                labels: labels.months,
                aspect: this.aspect || false,
                datasets: [{
                    label: labels.categories[0],
                    data: volumes[0],
                    lineTension: 0,
                    fill: false
                },
                {
                    label: labels.categories[1],
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

const CategoryImportTime = Vue.extend({
    extends: CategoryTime,
    mixins: [WatchMonth, WatchComp],
    computed: {
        categories() {
            return this.$store.getters["imports/getCategories"];
        },
        rawData() {
            return this.$store.getters["imports/getData"]("import/by_category");
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("imports/fetchByName", "by_category")
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    }
});


const CategorySalesTime = Vue.extend({
    extends: CategoryTime,
    mixins: [WatchMonth, WatchComp, WatchDepto],
    data() {
        return {amountType: "short"};
    },
    computed: {
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

const CategorySalesMTime = Vue.extend({
    extends: CategoryTime,
    mixins: [WatchMonth, WatchComp],
    data() {
        return {amountType: "short"};
    },
    computed: {
        categories() {
            return this.$store.getters["sales/getCategories"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("salesm/by_category");
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("sales/fetchByName", "salesm/by_category")
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    }
});

export {
    CategoryImportTime,
    CategorySalesTime,
    CategorySalesMTime
};