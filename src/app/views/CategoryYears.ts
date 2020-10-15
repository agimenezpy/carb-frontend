import Vue from 'vue';
import Loader from './Loader';
import { CategoryYearsChart, ColorSchemes } from './Charts';
import { FilterUtil, Record, WatchMonth } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <h5>{{header}} de {{title}}</h5>
            <Loader v-if="!loaded"/>
            <category-years-chart v-if="loaded" :chart-data="chartData"></category-years-chart>
        </div>
    </div>
</div>`;



const CategoryYears = Vue.extend({
    name: "CategoryYears",
    components: {
        CategoryYearsChart, Loader
    },
    mixins: [FilterUtil, WatchMonth],
    template,
    data() {
        return {
            loaded: false,
            title: "",
            colors: [],
            chartData: {}
        };
    },
    props: {
        header: String,
        type: String,
        xclass: String,
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByMonth").then(this.updateChart);
        },
        updateChart(filters: object = {}) {
            this.loaded = false;
            const categories: Map<string, string> = this.$store.getters.getMCategories;
            const rawData: Record[][] = [
                    this.$store.getters.getMDataY1,
                    this.$store.getters.getMDataY2
            ];
            const lastDate = rawData[1][rawData[1].length - 1].fecha;
            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const volumes: number[] = [];
            this.title = categories.get(this.type);
            const labels = [lastYear - 1, lastYear];

            if (!this.isEmpty(filters)) {
                rawData[0] = this.filterMonthData(filters, rawData[0]);
                rawData[1] = this.filterMonthData(filters, rawData[1]);
            }

            labels.forEach((value, idx) => {
                const vol = rawData[idx].filter(item => item.categoria === this.type)
                                        .reduce((sum, item) => sum + item.volumen, 0);
                volumes.push(vol);
            });
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: object, volumes: number[]) {
            this.chartData = {
                labels,
                datasets: [{
                    backgroundColor: (this.title === "GASOIL" ? this.colors[0] : this.colors[1]),
                    data: volumes,
                }]
            };
        }
    },
    mounted() {
        const schm = ColorSchemes.getColorSchemes();
        this.colors = [schm.office.Blue6,
                       schm.office.Orange6.slice(0, 2).reverse()];
        this.requestData();
    }
});

export default CategoryYears;