import Vue from 'vue';
import { StationChart } from './Charts';
import Loader from './Loader';
import { FilterUtil, FilterObj, Record, WatchComp, WatchDepto} from './mixins';

const template = `<div :class="[xclass]">
            <span class='font-size--3'>EESS y PCP por {{header}}</span>
            <Loader v-if="!loaded"/>
            <station-chart v-if="loaded" :chart-data="chartData" :aspect="aspect" :styles="styles"></station-chart>
    </div>
</div>`;

const Station = Vue.extend({
    name: "Station",
    components: {
        StationChart, Loader
    },
    mixins: [FilterUtil, WatchComp, WatchDepto],
    template,
    data() {
        return {
            loaded: false,
            chartData: {},
            promise: {}
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
            const grouping: Map<string, string> = this.grouping;
            let rawData: Record[] = this.rawData;

            if (!this.isEmpty(filters)) {
                rawData = this.doFilter(filters, rawData);
            }


            const dataset: Map<string, number> = new Map();
            grouping.forEach((value, key) => {
                const vol = rawData.filter((item: Record) => item[this.groupKey] === key)
                                   .reduce((sum, item) => sum + item.cantidad, 0);
                if (vol > 0) {
                    if (dataset.has(value)){
                        dataset.set(value, dataset.get(value) + vol);
                    }
                    else {
                        dataset.set(value, vol);
                    }
                }
            });
            const sortedDs: object[] = Array.from(dataset.entries()).sort((a, b) => a[1] < b[1] ? 1 : (a[1] === b[1]) ? 0 : -1);
            const labels = sortedDs.map((item) => (item[0]));
            const volumes = sortedDs.map((item) => (item[1]));
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: string[], volumes: number[]) {
            this.chartData = {
                labels,
                colors: 'office.Blue6',
                datasets: [
                    {
                        data: volumes
                    }
                ]
            };
        }
    },
    watch: {
        grouping() {
            this.promise.then(this.updateChart);
        }
    },
    computed: {
        rawData() {
            return this.$store.getters["sales/getData"]("sales/by_estacion");
        }
    },
    mounted() {
        this.promise = this.$store.dispatch("sales/fetchByName", "by_estacion");
    }
});

const StationCompany = Vue.extend({
    extends: Station,
    mixins: [WatchDepto, WatchComp],
    data() {
        return {
            groupKey: "distribuidor"
        };
    },
    methods: {
        doFilter(filters: FilterObj, rawData: Record[]) {
            return this.filterCompData(filters, rawData);
        }
    },
    computed: {
        grouping() {
            return this.$store.getters["sales/getCompanies"];
        }
    }
});

const StationDepartment = Vue.extend({
    extends: Station,
    mixins: [WatchDepto, WatchDepto],
    data() {
        return {
            groupKey: "departamento"
        };
    },
    methods: {
        doFilter(filters: FilterObj, rawData: Record[]) {
            return this.filterData(filters, rawData);
        }
    },
    computed: {
        grouping() {
            return this.$store.getters["sales/getDepartments"];
        }
    }
});

export { StationDepartment, StationCompany };