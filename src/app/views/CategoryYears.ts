import Vue from 'vue';
import Loader from './Loader';
import { CategoryYearsChart, ColorSchemes } from '../charts';
import { CardUtil, FilterUtil, Record, WatchMonth } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header.replace("$title", title)}}</div>
            <Loader v-if="!loaded && !empty && !error"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <div class="alert alert-yellow modifier-class is-active" v-if="empty">
                Sin datos
            </div>
            <category-years-chart v-if="loaded" :chart-data="chartData" :styles="styles"></category-years-chart>
        </div>
    </div>
</div>`;

interface Labels {
    years: number[];
    categories: string[];
}


const CategoryYears = Vue.extend({
    name: "CategoryYears",
    components: {
        CategoryYearsChart, Loader
    },
    mixins: [FilterUtil, WatchMonth, CardUtil],
    template,
    data() {
        return {
            title: "",
            colors: [],
            chartData: {}
        };
    },
    props: {
        header: String,
        type: String,
        xclass: String,
        styles: Object
    },
    methods: {
        requestData() {
            this.$store.dispatch("imports/fetchByName", "by_month/" + this.year).then(() => {
                this.$store.dispatch("imports/fetchByName", `by_month/${this.year - 1}`)
                        .then(this.updateChart)
                        .catch(this.onError);
            }).catch(this.onError);
        },
        updateChart(filters: object = {}) {
            this.loaded = false;
            const categories: Map<string, string> = this.$store.getters["imports/getCategories"];
            let rawData: Record[][] = [[], []];

            let lastDate = `${this.year}-12-1`;
            if (this.rawData.length > 1 && this.rawData[0].length > 0 && this.rawData[1].length > 0) {
                rawData = this.rawData;
                lastDate = rawData[1][rawData[1].length - 1].fecha;
            }

            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const volumes: object[] = [];
            const years = [lastYear - 1, lastYear];
            const labels: Labels = {
                "years": years,
                "categories": Array.from(categories.values())
            };

            if (!this.isEmpty(filters) && rawData[0].length > 0 && rawData[1].length > 0) {
                rawData[0] = this.filterMonthData(filters, rawData[0]);
                rawData[1] = this.filterMonthData(filters, rawData[1]);
            }

            years.forEach((value, idx) => {
                const vols: number[] = [];
                categories.forEach((id, type) => {
                    const vol = rawData[idx].filter(item => item.categoria === type)
                                            .reduce((sum, item) => sum + item.volumen, 0);
                    if (vol > 0) {
                        vols.push(vol);
                    }
                });
                volumes.push(vols);
            });
            this.setChartData(labels, volumes);
            this.title = `${years[0]} vs ${years[1]}`;
            this.loaded = true;
        },
        setChartData(labels: Labels, volumes: number[][]) {
            this.chartData = {
                labels: labels.years,
                datasets: [{
                    backgroundColor: this.colors[0],
                    label: labels.categories[0],
                    data:  volumes[0].length > 0 ? volumes.map((item: any) => (item[0])) : []
                },
                {
                    backgroundColor: this.colors[1],
                    label: labels.categories[1],
                    data: volumes[0].length > 0 ? volumes.map((item: any) => (item[1])) : []
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
        },
        rawData() {
            return [
                this.$store.getters["imports/getData"](`import/by_month/${this.year - 1}`),
                this.$store.getters["imports/getData"](`import/by_month/${this.year}`)
            ];
        }
    },
    mounted() {
        const schm = ColorSchemes.getColorSchemes();
        this.colors = [schm.office.Blue6,
                       schm.office.Orange6.slice(0, 2).reverse()];
        if (this.year > 0) {
            this.requestData();
        }
    }
});

export default CategoryYears;