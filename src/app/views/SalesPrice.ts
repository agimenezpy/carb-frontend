import Vue from 'vue';
import { Record } from './mixins';

const template = `<div :class="[xclass]">
    <div class="card">
        <div class='card-content' v-if="loaded">
            <div class="font-size--1">{{header}}</div>
            <div class="overflow-auto">
                <table class="table modifier-class">
                <thead>
                <tr>
                    <th>Producto</th>
                    <th v-for="(comp, idx) in company">
                        <a class="tooltip modifier-class" :aria-label="comp">
                            <img v-if="logos[idx] !== 'NIN'" :src="getLogo(logos[idx])" @error="noLogo">
                            <span v-if="logos[idx] === 'NIN'" class="font-size--3">{{ comp }}</span>
                        </a>
                    </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(prod, idx) in product">
                    <td><b class="font-size--3">{{prod}}</b></td>
                    <td v-for="(comp, jdx) in company">{{ fmt(values[idx][jdx]) }}</td>
                </tr>
                </tbody>
                </table>
            </div>
        </div>
    </div>
</div>`;

const SalesBase = Vue.extend({
    template,
    props: {
        header: String,
        xclass: String
    },
    data() {
        return {
            loaded: false,
            type: "GLA",
            company: [],
            product: [],
            logos: [],
            values: [],
            promise: {}
        };
    },
    methods: {
        getLogo(value: string) {
            return `http://gis.mic.gov.py/static/img/emb/${value}_64.png`;
        },
        noLogo(obj: any) {
            obj.target.src = (this.type === "GS") ? "http://gis.mic.gov.py/static/img/emb/NNGS_64.png" : "";
        },
        fmt(value: number) {
            return (value > 0) ?  Intl.NumberFormat("es-PY").format(value * 1000).replace(".000", "") : 'N/A';
        },
        updateChart() {
            this.loaded = false;
            const products: Map<string, string> = this.products;
            const emblems: Map<string, string> = this.emblems;
            const rawData: Record = this.rawData;

            const rows: string[] = this.rawData.rows;
            const columns: string[] = this.rawData.columns;
            this.company = columns.map((item: string) => emblems.get(item));
            this.logos = columns.map((item: string) => {
                let icon = (item === "TMG") ? "3MG" : item;
                icon = (icon.match(/CPT|PTP|PUM|PTBR|COPEG/) && this.type === "GS") ? icon + "GS" : icon;
                return icon;
            });
            this.product = rows.map((item: string) => products.get(item));
            this.values = rawData.data;
            this.loaded = true;
        }
    }
});

const SalesPrice = Vue.extend({
    name: "SalesPrice",
    extends: SalesBase,
    watch: {
        products() {
            this.promise.then(this.updateChart);
        }
    },
    computed: {
        products() {
            return this.$store.getters["sales/getProducts"];
        },
        emblems() {
            return this.$store.getters["sales/getEmblems"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("sales/by_price");
        }
    },
    mounted() {
        this.promise = this.$store.dispatch("sales/fetchByName", "by_price");
    }
});


const SalesGasPrice = Vue.extend({
    name: "SalesGasPrice",
    extends: SalesBase,
    data() {
        return {
            type: "GS"
        };
    },
    watch: {
        products() {
            this.promise.then(this.updateChart);
        }
    },
    computed: {
        products() {
            return this.$store.getters["sales/getProducts"];
        },
        emblems() {
            return this.$store.getters["sales/getEmblems"];
        },
        rawData() {
            return this.$store.getters["sales/getData"]("sales/gas/by_price");
        }
    },
    mounted() {
        this.promise = this.$store.dispatch("sales/fetchByName", "gas/by_price");
    }
});

export { SalesPrice, SalesGasPrice };