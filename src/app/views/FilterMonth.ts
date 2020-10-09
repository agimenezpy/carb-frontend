import Vue from 'vue';
import {mapState} from 'vuex';

const template = `<div class="">
    <h4 class="side-nav-title">
        <div class="column-4">Filtro por mes</div>
        <div title="Limpiar Filtros" class="icon-ui-filter icon-ui-gray" :class="{'icon-ui-red': filtered}" v-on:click="checkEvent"></div>
    </h4>
    <nav role="navigation" aria-labelledby="sidenav">
    <fieldset class="fieldset-checkbox">
        <template v-for="mes in meses">
            <label class="side-nav-link font-size--2"><input type="checkbox" name="meses" :value="mes" v-model="checked" @change="checkMonth">{{mes}}</label>
        </template>
    </fieldset>
    </nav>
</div>`


const FilterMonth = Vue.extend({
    name: "FilterMonth",
    data() {
        return {
            checked: [],
            filtered: false
        }
    },
    computed: {
        ...mapState({
            meses: (state: any) => state.FilterStore.MONTHS
        })
    },
    methods: {
        checkEvent(event: any) {
            this.filtered = !this.filtered;
            if (!this.filtered) {
                this.checked = this.meses;
            }
            else {
                this.checked = [];
            }
            this.$store.dispatch("setFilterMonth", this.checked);
        },
        checkMonth(event: any) {
            let count = this.checked.length
            this.filtered =  count < this.meses.length;
            this.$store.dispatch("setFilterMonth", this.checked);
        }
    },
    mounted() {
        this.checked = this.meses;
    },
    template
});

export default FilterMonth;