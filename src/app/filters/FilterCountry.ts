import Vue from 'vue';
import {mapState} from 'vuex';

const template = `<div>
    <h4 class="side-nav-title font-size--3">
        Pais
        <div class="right">
            <a title="Filtrar" role="button" class="icon-ui-checkbox-checked link-off-black" :class="{'icon-ui-checkbox-unchecked': filtered, 'icon-ui-gray': !show}" v-on:click="checkEvent"></a>
            <a title="Mostrar/Ocultar" role="button" class="icon-ui-down link-off-black" :class="{'icon-ui-up': show}" @click="show = !show"></a>
        </div>
    </h4>
    <transition name="fade">
        <fieldset class="fieldset-checkbox" v-if="show">
            <template v-for="(value, idx) in countries">
                <label class="side-nav-link">
                    <input type="checkbox" name="cntry" :value="value[0]" v-model="checked" @change="checkCountry">
                    <span class="font-size--3">{{value[1]}}</span>
                </label>
            </template>
        </fieldset>
    </transition>
</div>`;

const FilterCountry = Vue.extend({
    name: "FilterCountry",
    data() {
        return {
            checked: [],
            filtered: false,
            show: true
        };
    },
    watch: {
        countries() {
            this.checked = Array.from(this.countries.keys());
        }
    },
    computed: {
        ...mapState({
            countries: (state: any) => state.FilterStore.CNTRY
        })
    },
    methods: {
        checkEvent(event: any) {
            this.filtered = !this.filtered;
            this.checked = !this.filtered ? ["AR", "BO"] : [];
            this.$store.dispatch("setFilterCntry", this.checked);
        },
        checkCountry(event: any) {
            this.filtered = this.checked.length < this.countries.length;
            this.$store.dispatch("setFilterCntry", this.checked);
        }
    },
    template
});

export default FilterCountry;