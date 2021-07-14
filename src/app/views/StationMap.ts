import Vue from 'vue';
import { GeoMapChart, getTopoJSON, TopoJSONType, ColorSchemes} from '../charts';
import Loader from './Loader';
import { FilterUtil, FilterObj, Record, WatchComp, CardUtil} from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class="card-content">
            <div class="font-size--3">{{header}}</div>
            <Loader v-if="!loaded && !error && !empty"/>
            <div class="alert alert-red modifier-class is-active" v-if="error">
                Error al obtener datos
            </div>
            <div class="alert alert-yellow modifier-class is-active" v-if="empty">
                Sin datos
            </div>
            <geo-map-chart v-if="loaded" :chart-data="chartData" :aspect="aspect" :styles="styles"></geo-map-chart>
        </div>
    </div>
</div>`;

const StationMap = Vue.extend({
    name: "StationMap",
    components: {
        GeoMapChart, Loader
    },
    mixins: [FilterUtil, WatchComp, CardUtil],
    template,
    data() {
        return {
            loaded: false,
            chartData: {},
            features: [],
            title: "Departamento",
            colors: []
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
            const departments: TopoJSONType[] = this.features;
            let rawData: Record[] = this.rawData;

            const labels: string[] = [];
            const volumes: number[] = [];

            if (!this.isEmpty(filters)) {
                rawData = this.filterCompData(filters, rawData);
            }

            departments.map((feature) => {
                const vol = rawData.filter((item: Record) => item.departamento === feature.properties.codigo)
                                   .reduce((sum, item) => sum + item.cantidad, 0);
                labels.push(feature.properties.nombre);
                volumes.push(vol);
            });
            this.setChartData(labels, volumes);
            this.loaded = true;
        },
        setChartData(labels: string[], qty: number[]) {
            this.chartData = {
                labels,
                datasets: [
                    {
                        label: this.title,
                        outline: this.features,
                        showOutline: true,
                        data: this.features.map((feature: any, idx: number) => ({
                            feature,
                            value: qty[idx]
                        }))
                    }
                ]
            };
        }
    },
    computed: {
        rawData() {
            return this.$store.getters["sales/getData"]("sales/by_estacion");
        },
        geojson() {
            return this.$store.getters["sales/getData"]("assets/paraguay.json");
        }
    },
    mounted() {
        const schm = ColorSchemes.getColorSchemes();
        this.colors = [...schm.office.Blue6, ...schm.brewer.Blues6];
        Promise.all([this.$store.dispatch("sales/fetchGeoData", "assets/paraguay.json"),
                     this.$store.dispatch("sales/fetchByName", "by_estacion")])
        .then(() => {
            const geodeps = this.geojson;
            this.features = getTopoJSON().feature(geodeps, geodeps.objects.departamentos).features;
            this.updateChart();
        });
    }
});

export { StationMap };