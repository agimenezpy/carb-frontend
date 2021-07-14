import Vue from 'vue';
import {mapGetters} from 'vuex';

const template = `<div class="" v-if="yearsList.length > 0">
    <div class="side-nav-title font-size--3" >
        Año
        <div class="right">
            <a title="Mostrar/Ocultar" role="button" class="icon-ui-down link-off-black" :class="{'icon-ui-up': show}" @click="show = !show"></a>
        </div>
    </div>
    <transition name="fade">
        <fieldset class="fieldset-checkbox" v-if="show">
            <template v-for="(year, idx) in yearsList">
                <label class="side-nav-link">
                    <input type="radio" name="years" :value="year" v-model="checked" @change="checkYear">
                    <span class="font-size--3">{{year}}</span>
                </label>
            </template>
        </fieldset>
    </transition>
</div>`;


const FilterYear = Vue.extend({
    name: "FilterYear",
    data() {
        return {
            checked: -1,
            yearsList: [],
            show: true
        };
    },
    watch: {
        years() {
            this.yearsList = Array.from(this.years).reverse();
            this.checked = this.year;
        }
    },
    computed: {
        ...mapGetters({
            years: 'getYears',
            year: 'getYear'
        })
    },
    methods: {
        checkYear(event: any) {
            this.$store.dispatch("setDefaultYear", this.checked);
        }
    },
    template
});

export default FilterYear;