import Vue from 'vue';
import Loader from './Loader';
import { CategoryYearsChart, ColorSchemes } from '../charts';
import { FilterUtil, Record, WatchMonth } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header.replace("$title", title)}}</div>
            <Loader v-if="!loaded"/>
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
    mixins: [FilterUtil, WatchMonth],
    template,
    data() {
        return {
            loaded: false,
            title: "",
            colors: [],
            chartData: {},
            year: 0
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
            this.$store.dispatch("imports/fetchByName", "by_month").then(() => {
                const rawData = this.$store.getters["imports/getData"]("import/by_month");
                const lastDate = rawData[rawData.length - 1].fecha;
                this.year = parseInt(lastDate.split("-")[0], 10);
                this.$store.dispatch("imports/fetchByName", `by_month/${this.year - 1}`)
                            .then(this.updateChart)
                            .catch(this.onError);
            }).catch(this.onError);
        },
        updateChart(filters: object = {}) {
            this.loaded = false;
            const categories: Map<string, string> = this.$store.getters["imports/getCategories"];
            const rawData: Record[][] = [
                this.$store.getters["imports/getData"](`import/by_month/${this.year - 1}`),
                this.$store.getters["imports/getData"](`import/by_month`)
            ];
            const lastDate = rawData[1][rawData[1].length - 1].fecha;
            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const volumes: object[] = [];
            const years = [lastYear - 1, lastYear];
            const labels: Labels = {
                "years": years,
                "categories": Array.from(categories).map(item => (item[1]))
            };

            if (!this.isEmpty(filters)) {
                rawData[0] = this.filterMonthData(filters, rawData[0]);
                rawData[1] = this.filterMonthData(filters, rawData[1]);
            }

            years.forEach((value, idx) => {
                const vols: number[] = [];
                categories.forEach((id, type) => {
                    const vol = rawData[idx].filter(item => item.categoria === type)
                                            .reduce((sum, item) => sum + item.volumen, 0);
                    vols.push(vol);
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
                    data: volumes.map((item: any) => (item[0]))
                },
                {
                    backgroundColor: this.colors[1],
                    label: labels.categories[1],
                    data: volumes.map((item: any) => (item[1]))
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