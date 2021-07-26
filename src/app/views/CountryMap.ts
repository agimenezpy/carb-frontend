import Vue from 'vue';
import { GeoMapChart, getTopoJSON, TopoJSONType, ColorSchemes} from '../charts';
import Loader from './Loader';
import { FilterUtil, FilterObj, Record, CardUtil, WatchComp, WatchMonth} from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class="card-content">
            <div class="font-size--3">{{header}}</div>
            <Loader v-if="!loaded && !error && !empty"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <div class="modifier-class is-active" v-if="empty">
                Sin datos
            </div>
            <geo-map-chart v-if="loaded" :chart-data="chartData" :aspect="aspect" :styles="styles"></geo-map-chart>
        </div>
    </div>
</div>`;

const CountryMap = Vue.extend({
    name: "CountryMap",
    components: {
        GeoMapChart, Loader
    },
    mixins: [CardUtil, FilterUtil, WatchComp, WatchMonth],
    template,
    data() {
        const schemes = ColorSchemes.getColorSchemes();
        return {
            chartData: {},
            features: [],
            title: "Pais",
            colors: [schemes.brewer.BuGn3[0], schemes.brewer.BuGn3[2], schemes.brewer.BuGn3[1]],
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
            this.empty = false;
            const countries: TopoJSONType[] = this.features;
            let rawData: Record[] = this.rawData;

            const labels: string[] = [];
            const volumes: number[] = [];

            if (!this.isEmpty(filters) && rawData.length > 0) {
                rawData = this.filterDualData(filters, rawData);
            }

            let suma = 0;
            countries.map((feature) => {
                const vol = rawData.filter((item: Record) => item.pais === feature.properties.iso_a2)
                                   .reduce((sum, item) => sum + item.volumen, 0);
                labels.push(feature.properties.admin);
                volumes.push(vol);
                suma += vol;
            });
            this.loaded = true;
            this.setChartData(labels, volumes, suma);
        },
        setChartData(labels: string[], qty: number[], sum: number) {
            //[schemes.brewer.BuGn3[1], schemes.brewer.BuGn3[2], schemes.brewer.BuGn3[0]]
            const colors = [...this.colors];
            
            let data = [];
            if (sum >= 0) {
                data = this.features.map((feature: any, idx: number) => ({
                    feature,
                    value: qty[idx]
                }));
            }
            this.chartData = {
                labels,
                colors,
                color: "white",
                fontSize: "8",
                datasets: [
                    {
                        label: this.title,
                        outline: this.features,
                        showOutline: true,
                        data
                    }
                ]
            };
        },
        requestData() {
            this.$store.dispatch("imports/fetchByName", "gas/by_category/" + this.year)
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
        rawData() {
            return this.$store.getters["imports/getData"]("import/gas/by_category/" + this.year);
        },
        geojson() {
            return this.$store.getters["sales/getData"]("assets/south.json");
        }
    },
    async mounted() {
        await this.$store.dispatch("sales/fetchGeoData", "assets/south.json");
        const geodeps = this.geojson;
        this.features = getTopoJSON().feature(geodeps, geodeps.objects.sa).features;

        if (this.year > 0) {
            this.requestData();
        }
    }
});

export { CountryMap };