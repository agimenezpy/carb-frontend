import Vue from 'vue';
import {mapState} from 'vuex'; 

const template = `<div>
    <h4 class="side-nav-title">
        <div class="column-4">Filtro por empresa</div>
        <div title="Limpiar Filtros" class="icon-ui-filter icon-ui-gray" :class="{'icon-ui-red': filtered}" v-on:click="checkEvent"></div>
    </h4>
    <nav role="navigation" aria-labelledby="sidenav">
    <fieldset class="fieldset-checkbox">
        <template v-for="(value, idx) in comps">
            <label class="side-nav-link font-size--2"><input type="checkbox" name="comp" :value="value[0]" v-model="checked" @change="checkComp">{{value[1]}}</label>
        </template>
    </fieldset>
    </nav>
</div>`

const FilterCompany = Vue.extend({
    name: "FilterCompany",
    data() {
        return {
            comps: [],
            checked: [],
            filtered: false
        }
    },
    watch: {
        companies() {
            if (this.companies.size > 0) {
                let rawData = this.$store.getters.getComData;
                this.comps = new Map(Array.from(this.companies.keys()).map(item => {
                    return [
                        item, 
                        rawData.filter((ditem: object) => ditem["distribuidor"] == item)
                               .reduce((sum: number, ditem: object) => sum + 1, 0)
                    ]
                })
                .filter(item => item[1] > 0)
                .map(item => [item[0], this.companies.get(item[0])]));
                this.checked = Array.from(this.comps.keys());
                this.$store.dispatch("setFCompanies", this.comps);
            }
        }
    },
    computed: {
        ...mapState({
            companies: (state: any) => state.CompanyStore.company
        })
    },
    methods: {
        checkEvent(event: any) {
            this.filtered = !this.filtered;
            if (!this.filtered) {
                this.checked = Array.from(this.comps.keys());
            }
            else {
                this.checked = [];
            }
            this.$store.dispatch("setFilterDist", this.checked);
        },
        checkComp(event: any) {
            let count = this.checked.length
            this.filtered = count < this.comps.size;
            this.$store.dispatch("setFilterDist", this.checked);
        }
    },
    template
});

export default FilterCompany;