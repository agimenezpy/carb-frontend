import Vue from 'vue';
import Loader from './Loader';
import { ClientMixChart } from '../charts';
import { CardUtil, FilterObj, FilterUtil, Record, WatchComp, WatchMonth } from './mixins';

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
            <client-mix-chart v-if="loaded" :chart-data="chartData" :title="title" :aspect="aspect" :styles="styles"></client-mix-chart>
        </div>
    </div>
</div>`;

interface Labels {
    clients: string[];
    categories: string[];
}

const ClientMixer = Vue.extend({
    name: "ClientMixer",
    components: {
        ClientMixChart, Loader
    },
    mixins: [FilterUtil, WatchComp, WatchMonth, CardUtil],
    template,
    data() {
        return {
            chartData: {},
            promise: {},
            title: ""
        };
    },
    props: {
        header: String,
        type: String,
        xclass: String,
        aspect: Boolean,
        styles: Object
    },
    methods: {
        updateChart(filters: FilterObj = {}) {
            this.loaded = false;
            this.empty = false;
            const clients: string[] = [];
            const categories: Map<string, string> = this.categories;
            let rawData: Record[] = this.rawData;

            if (rawData.length < 1) {
                this.empty = true;
                return;
            }

            if (!this.isEmpty(filters)) {
                rawData = this.filterDualData(filters, rawData);
            }

            let dataset: object[] = [];
            const labels: Labels = {
                clients: new Array<string>(),
                categories: Array.from(categories).map(item => (item[1]))
            };

            rawData.forEach((value, idx) => {
                if (clients.indexOf(value.comprador) < 0) {
                    clients.push(value.comprador);
                }
            });

            clients.forEach((value, idx) => {
                const vols: number[] = [];
                let total: number = 0;
                categories.forEach((cat, key) => {
                    const vol =  rawData.filter(item => item.comprador === value &&
                                                item.categoria === key)
                                        .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);
                    total += vol;
                });
                if (total > 0) {
                    dataset.push([value, vols, total]);
                }
            });
            dataset = dataset.sort((a, b) => a[2] < b[2] ? 1 : (a[2] === b[2]) ? 0 : -1);
            labels.clients = dataset.map((item) => (item[0]));
            const volumes: number[][] = dataset.map((item) => (item[1]));
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: number[]) {
            this.chartData = {
                labels: labels.clients,
                datasets: [{
                    label: labels.categories[0],
                    data: volumes.map((item: any) => (item[0]))
                },
                {
                    label: labels.categories[1],
                    data: volumes.map((item: any) => (item[1]))
                }]
            };
        },
        requestData() {
            this.$store.dispatch("sales/fetchByName", "salesm/by_client/" + this.year)
                    .then(this.updateChart)
                    .catch(this.onError);
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
        },
        categories() {
            return this.$store.getters["sales/getCategories"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("salesm/by_client/" + this.year);
        }
    },
    mounted() {
        if (this.year > 0) {
            this.requestData();
        }
    }
});

export { ClientMixer };