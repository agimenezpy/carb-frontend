import Vue from 'vue';
import {mapState} from 'vuex';

const template = `<div class="">
    <h4 class="side-nav-title" >
        <div class="column-3 font-size--3">Filtro por mes</div>
        <div class="text-right">
        <a title="Filtrar" role="button" class="icon-ui-checkbox-checked link-off-black" :class="{'icon-ui-checkbox-unchecked': filtered, 'icon-ui-gray': !show}" v-on:click="checkEvent"></a>
        <a title="Mostrar/Ocultar" role="button" class="icon-ui-down link-off-black" :class="{'icon-ui-up': show}" @click="show = !show"></a>
        </div>
    </h4>
    <transition name="fade">
        <nav role="navigation" aria-labelledby="sidenav" v-if="show">
        <fieldset class="fieldset-checkbox">
            <template v-for="(mes, idx) in meses">
                <span class="side-nav-link font-size--6"><input type="checkbox" name="meses" :value="idx+1" v-model="checked" @change="checkMonth">{{mes}}</span>
            </template>
        </fieldset>
        </nav>
    </transition>
</div>`;


const FilterMonth = Vue.extend({
    name: "FilterMonth",
    data() {
        return {
            checked: [],
            filtered: false,
            show: true
        };
    },
    computed: {
        ...mapState({
            meses: (state: any) => state.FilterStore.MONTHS
        })
    },
    methods: {
        checkEvent(event: any) {
            this.filtered = !this.filtered;
            this.checked = (!this.filtered) ? Array.from(this.meses.keys()).map((value: number) => (value + 1)) : [];
            this.$store.dispatch("setFilterMonth", this.checked);
        },
        checkMonth(event: any) {
            this.filtered =  this.checked.length < this.meses.length;
            this.$store.dispatch("setFilterMonth", this.checked);
        }
    },
    mounted() {
        this.checked = Array.from(this.meses.keys()).map((value: number) => (value + 1));
    },
    template
});

export default FilterMonth;