import Vue from 'vue';
import { CategoryBarTimeChart, ColorSchemes } from '../charts';
import { FilterUtil, FilterObj, Record, WatchMonth, WatchComp, CardUtil, WatchCntry } from './mixins';
import Loader from './Loader';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content'>
            <div class="font-size--3">{{header.replace("$year", title)}}</div>
            <Loader v-if="!loaded && !error && !empty"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <div class="alert alert-yellow modifier-class is-active" v-if="empty">
                Sin datos
            </div>
            <category-bar-time-chart v-if="loaded" :chart-data="chartData" :styles="styles" ></category-bar-time-chart>
        </div>
    </div>
</div>`;

interface Labels {
    [propName: string]: string[];
}

const CountryBarTime = Vue.extend({
    name: "CountryBarTime",
    components: {
        CategoryBarTimeChart, Loader
    },
    mixins: [FilterUtil, CardUtil],
    template,
    data() {
        return {
            chartData: {},
            title: ""
        };
    },
    props: {
        header: String,
        xclass: String,
        styles: Object,
        type: String
    },
    methods: {
        updateChart1YR(filters: FilterObj = {}) {
            this.loaded = false;
            const countries: Map<string, string> = this.countries;
            let rawData: Record[] = [];

            let lastDate = `${this.year}-12-1`;
            if (this.rawData.length > 0) {
                rawData = this.rawData;
                lastDate = rawData[rawData.length - 1].fecha;
            }

            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const lastMonth = parseInt(lastDate.split("-")[1], 10);


            const labels: Labels = {
                "months": [],
                "countries": Array.from(countries.values()),
            };
            const volumes: object[] = [];
            const fMonth = filters.fMonth;

            if (!this.isEmpty(filters) && rawData.length > 0) {
                rawData = this.filterData(filters, rawData);
            }

            let maxMonth = 0;
            const months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);

            countries.forEach((value, key) => {
                const vols: number[] = [];
                months.forEach((month) => {
                    if (fMonth !== undefined && fMonth.indexOf(month) < 0 || rawData.length === 0) {
                        return;
                    }
                    const fmt = `${lastYear}-${month < 10 ? '0' : ''}${month}-01`;
                    const vol =  rawData.filter(item => item.pais === key && item.fecha === fmt)
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
        updateChart2YR(filters: FilterObj = {}) {
            this.loaded = false;
            const countries: Map<string, string> = this.countries;
            let rawData: Record[][] = [[], []];

            let lastDate = `${this.year}-12-1`;
            if (this.rawData.length > 1 && this.rawData[0].length > 0 && this.rawData[1].length > 0) {
                rawData = this.rawData;
                lastDate = rawData[1][rawData[1].length - 1].fecha;
            }

            const lastYear = parseInt(lastDate.split("-")[0], 10);
            const lastMonth = parseInt(lastDate.split("-")[1], 10);
            const years = [lastYear - 1, lastYear];
            const months: number[] = Array.from(Array(lastMonth + 1).keys()).slice(1);

            const labels: Labels = {
                "months": [],
                "countries": []
            };
            const volumes: object[] = [];
            const fMonth = filters.fMonth;

            if (!this.isEmpty(filters) && rawData[0].length > 0 && rawData[1].length > 0) {
                rawData = [this.filterData(filters, rawData[0]), this.filterData(filters, rawData[1])];
            }

            let maxMonth = 0;

            years.forEach((year, idx) => {
                countries.forEach((value, key) => {
                    const vols: number[] = [];
                    months.forEach((month) => {
                        if (fMonth !== undefined && fMonth.indexOf(month) < 0 || rawData.length === 0) {
                            return;
                        }
                        const fmt = `${year}-${month < 10 ? '0' : ''}${month}-01`;
                        const vol =  rawData[idx].filter(item => item.pais === key && item.fecha === fmt)
                                            .reduce((sum, item) => sum + item.volumen, 0);
                        vols.push(vol);
                        if (labels.months.length < months.length && month > maxMonth) {
                            labels.months.push(this.MONTHS[month - 1]);
                            maxMonth = month;
                        }
                    });

                    labels.countries.push(`${value}/${year}`);
                    volumes.push(vols);
                });
            });
            this.setChartData(`${years[0]} vs ${years[1]}`, labels, volumes);
            this.loaded = true;
        },
        setChartData(title: string, labels: Labels, volumes: object[]) {
            this.title = title;
            this.chartData = {
                labels: labels.months,
                showLabels: true, showTicks: this.showTicks || false,
                showLegend: true, largeTicks: true,
                colors: this.colors,
                labelRotation: -90,
                xLabelRotation: 0,
                datasets:  volumes.map((item, idx) => {
                    return {
                        label: labels.countries[idx],
                        data: item
                    };
                })
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

const CountryImportGasTime = Vue.extend({
    extends: CountryBarTime,
    mixins: [WatchMonth, WatchComp, WatchCntry],
    data() {
        const schemes = ColorSchemes.getColorSchemes();
        return {
            colors: [schemes.brewer.BuGn3[0], schemes.brewer.BuGn3[2]]
        };
    },
    computed: {
        countries() {
            return this.$store.getters["imports/getCountries"];
        },
        rawData() {
            return this.$store.getters["imports/getData"]("import/gas/by_category/" + this.year);
        }
    },
    methods: {
        updateChart(filters: object) {
            return this.updateChart1YR(filters);
        },
        requestData() {
            this.$store.dispatch("imports/fetchByName", "gas/by_category/" + this.year)
                       .then(this.updateChart1YR)
                       .catch(this.onError);
        }
    }
});

const CountryImportGasMonth = Vue.extend({
    extends: CountryBarTime,
    mixins: [WatchMonth, WatchCntry],
    data() {
        const schemes = ColorSchemes.getColorSchemes();
        return {
            colors: [
                schemes.brewer.BuGn4[0], schemes.brewer.BuGn4[2],
                schemes.brewer.BuGn4[1], schemes.brewer.BuGn4[3]
            ]
        };
    },
    computed: {
        countries() {
            return this.$store.getters["imports/getCountries"];
        },
        rawData() {
            return [
                this.$store.getters["imports/getData"](`import/gas/by_month/${this.year - 1}`),
                this.$store.getters["imports/getData"](`import/gas/by_month/${this.year}`)
            ];
        }
    },
    methods: {
        updateChart(filters: object) {
            return this.updateChart2YR(filters);
        },
        requestData() {
            this.$store.dispatch("imports/fetchByName", `gas/by_month/${this.year}`).then(() => {
                this.$store.dispatch("imports/fetchByName", `gas/by_month/${this.year - 1}`)
                            .then(this.updateChart2YR)
                            .catch(this.onError);
            }).catch(this.onError);
        }
    }
});

export {
    CountryImportGasTime, CountryImportGasMonth
};