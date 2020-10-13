import Vue from 'vue';
import {mapState} from 'vuex';

const template = `<div>
    <h4 class="side-nav-title">
        <div class="column-3">Filtro por empresa</div>
        <div class="text-right">
            <a title="Filtrar" role="button" class="icon-ui-checkbox-checked link-off-black" :class="{'icon-ui-checkbox-unchecked': filtered, 'icon-ui-gray': !show}" v-on:click="checkEvent"></a>
            <a title="Mostrar/Ocultar" role="button" class="icon-ui-down link-off-black" :class="{'icon-ui-up': show}" @click="show = !show"></a>
        </div>
    </h4>
    <transition name="fade">
        <nav role="navigation" aria-labelledby="sidenav" v-if="show">
        <fieldset class="fieldset-checkbox">
            <template v-for="(value, idx) in comps">
                <div class="side-nav-link  font-size--6"><input type="checkbox" name="comp" :value="value[0]" v-model="checked" @change="checkComp">{{value[1]}}</div>
            </template>
        </fieldset>
        </nav>
    </transition>
</div>`

const FilterCompany = Vue.extend({
    name: "FilterCompany",
    data() {
        return {
            comps: [],
            checked: [],
            filtered: false,
            show: true
        }
    },
    watch: {
        companies() {
            if (this.companies.size > 0) {
                const rawData = this.$store.getters.getComData;
                this.comps = new Map(Array.from(this.companies.keys()).map(item => {
                    return [
                        item,
                        rawData.filter((ditem: object) => ditem.distribuidor === item)
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
            this.checked = !this.filtered ? Array.from(this.comps.keys()) : [];
            this.$store.dispatch("setFilterDist", this.checked);
        },
        checkComp(event: any) {
            const count = this.checked.length
            this.filtered = count < this.comps.size;
            this.$store.dispatch("setFilterDist", this.checked);
        }
    },
    template
});

export default FilterCompany;