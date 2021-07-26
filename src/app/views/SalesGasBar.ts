import Vue from 'vue';
import { CompanyBarChart, ColorSchemes } from '../charts';
import Loader from './Loader';
import { FilterUtil, FilterObj, Record, WatchComp, WatchMonth, CardUtil } from './mixins';

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

interface Labels {
    companies: string[];
    categories: string[][];
}

const SalesGasBar = Vue.extend({
    name: "SalesGasBar",
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
            const category: Map<string, string> = this.categories;
            let rawData: Record[] = [];
            const fComp = filters.fComp;

            if (this.rawData.length > 0) {
                rawData = this.rawData;
            }

            const labels: Labels = {
                "companies": [],
                "categories": Array.from(category.entries())
                                   .sort((a, b) => a[0] > b[0] ? 1 : a[0] === b[0] ? 0 : -1)
            };

            if (!this.isEmpty(filters) && rawData.length > 0) {
                rawData = this.filterData(filters, rawData);
            }

            const dataset: object[] = [];
            companies.forEach((value, key) => {
                const vols: number[] = [];
                let total: number = 0;
                if (fComp !== undefined && fComp.indexOf(key) < 0 || rawData.length === 0) {
                    return;
                }

                labels.categories.forEach(([catkey, _], idx) => {
                    const vol =  rawData.filter(item => item.distribuidor === key && item.destino === catkey)
                                        .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);
                    total += vol;
                });

                if (total > 0) {
                    dataset.push([value, vols, total]);
                }
            });
            labels.companies = dataset.map((item) => (item[0]));
            const volumes: number[][] = dataset.map((item) => (item[1]));
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: object[]) {
            this.chartData = {
                labels: labels.companies,
                showLabels: true,
                showTicks: false,
                showLegend: true,
                hideLabelZero: true,
                legendPosition: "bottom",
                colors: this.colors,
                labelRotation: -90,
                datasets: labels.categories.map((labely, idx) => ({
                    label: `VENTAS ${idx < 2 ? "EN" : "A"} ${labely[1]} (kg)`,
                    data: volumes.map((item: any) => (item[idx]))
                }))
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

const SalesDestinationGas = Vue.extend({
    extends: SalesGasBar,
    mixins: [WatchComp, WatchMonth],
    data() {
        const schemes = ColorSchemes.getColorSchemes();
        return {
            colors: [schemes.brewer.Blues3[2],  schemes.brewer.Blues3[1],  schemes.brewer.Blues3[0]]
        };
    },
    computed: {
        companies() {
            return this.$store.getters["sales/getCompanies"];
        },
        categories() {
            return this.$store.getters["sales/getDestinations"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("sales/gas/by_destination/" + this.year);
        }
    },
    methods: {
        requestData() {
            this.$store.dispatch("sales/fetchByName", "gas/by_destination/" + this.year)
                       .then(this.updateChart)
                       .catch(this.onError);
        }
    }
});

export { SalesDestinationGas };