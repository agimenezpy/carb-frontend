import Vue from 'vue';
import Loader from './Loader';
import { CategoryChart, ColorSchemes } from './Charts';
import { FilterUtil, FilterObj, Record, WatchMonth, WatchComp } from './mixins';


const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <h5 class="font-size--1">{{header}} de {{title}}</h5>
            <Loader v-if="!loaded"/>
            <category-chart v-if="loaded" :chart-data="chartData" :aspect="aspect"></category-chart>
        </div>
    </div>
</div>`;

const Category = Vue.extend({
    name: "Category",
    components: {
        CategoryChart, Loader
    },
    mixins: [FilterUtil, WatchMonth, WatchComp],
    template,
    data() {
        return {
            loaded: false,
            chartData: {},
            colors: [],
            title: ""
        };
    },
    props: {
        header: String,
        type: String,
        xclass: String,
        aspect: Boolean
    },
    methods: {
        requestData() {
            this.$store.dispatch("fetchByCategory").then(this.updateChart);
        },
        updateChart(filters: FilterObj = {fComp: undefined, fMonth: undefined}) {
            this.loaded = false;
            const categories: Map<string, string> = this.$store.getters.getCategories;
            let rawData: Record[] = this.$store.getters.getCatData;

            const labels: string[] = [];
            const volumes: number[] = [];

            if (!this.isEmpty(filters)) {
                rawData = this.filterDualData(filters, rawData);
            }

            categories.forEach((value, key) => {
                const vol = rawData.filter(item => item.categoria === key)
                                 .reduce((sum, item) => sum + item.volumen, 0);
                if (vol > 0) {
                    labels.push(value);
                    volumes.push(vol);
                }
            });
            this.title = categories.get(this.type);
            this.loaded = true;
            this.setChartData(labels, volumes);
        },
        setChartData(labels: string[], volumes: number[]) {
            this.chartData = {
                colors: this.title === "GASOIL" ? this.colors[0] : this.colors[1],
                invert: this.title !== "GASOIL",
                labels,
                datasets: [
                    {
                        data: volumes
                    }
                ]
            };
        }
    },
    mounted() {
        const schemes = ColorSchemes.getColorSchemes();
        this.colors = [[schemes.office.Blue6[0], schemes.brewer.Blues6[0]],
                        [schemes.brewer.Oranges6[0], schemes.office.Orange6[0]]];
        this.requestData();
    }
});

export default Category;