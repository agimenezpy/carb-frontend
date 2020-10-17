import Vue from 'vue';
import {mapGetters} from 'vuex';

const template = `<div>
    <h4 class="side-nav-title font-size--3">
        Empresa
        <div class="right">
            <a title="Filtrar" role="button" class="icon-ui-checkbox-checked link-off-black" :class="{'icon-ui-checkbox-unchecked': filtered, 'icon-ui-gray': !show}" v-on:click="checkEvent"></a>
            <a title="Mostrar/Ocultar" role="button" class="icon-ui-down link-off-black" :class="{'icon-ui-up': show}" @click="show = !show"></a>
        </div>
    </h4>
    <transition name="fade">
        <fieldset class="fieldset-checkbox" v-if="show">
            <template v-for="(value, idx) in comps">
                <label class="side-nav-link">
                    <input type="checkbox" name="comp" :value="value[0]" v-model="checked" @change="checkComp">
                    <span class="font-size--3">{{value[1]}}</span>
                </label>
            </template>
        </fieldset>
    </transition>
</div>`;

const FilterCompany = Vue.extend({
    name: "FilterCompany",
    data() {
        return {
            comps: [],
            checked: [],
            filtered: false,
            show: true
        };
    },
    watch: {
        companies(companies: Map<number, string>) {
            if (companies.size > 0) {
                const rawData = this.$store.getters.getComData;
                this.setCompanies(companies, rawData);
            }
        },
        companiesSales(companies: Map<number, string>) {
            if (companies.size > 0) {
                const rawData = this.$store.getters["sales/getData"]("sales/by_category");
                this.setCompanies(companies, rawData);
            }
        }
    },
    computed: {
        ...mapGetters({
            companies: 'getCompanies',
            companiesSales: 'sales/getCompanies'
        })
    },
    methods: {
        checkEvent(event: any) {
            this.filtered = !this.filtered;
            this.checked = !this.filtered ? Array.from(this.comps.keys()) : [];
            this.$store.dispatch("setFilterDist", this.checked);
        },
        checkComp(event: any) {
            const count = this.checked.length;
            this.filtered = count < this.comps.size;
            this.$store.dispatch("setFilterDist", this.checked);
        },
        setCompanies(companies: Map<number, string>, rawData: object[]) {
            this.comps = new Map(Array.from(companies.keys()).map(item => {
                return [
                    item,
                    rawData.filter((ditem: any) => ditem.distribuidor === item)
                           .reduce((sum: number, ditem: object) => sum + 1, 0)
                ];
            })
            .filter(item => item[1] > 0)
            .map(item => [item[0], companies.get(item[0])]));
            this.checked = Array.from(this.comps.keys());
            this.$store.dispatch("setFCompanies", this.comps);
        }
    },
    template
});

export default FilterCompany;