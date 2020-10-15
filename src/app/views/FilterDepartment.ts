import Vue from 'vue';
import {mapGetters} from 'vuex';

const template = `<div>
    <h4 class="side-nav-title">
        <div class="column-3 font-size--3">Filtro por departamento</div>
        <div class="text-right">
            <a title="Filtrar" role="button" class="icon-ui-checkbox-checked link-off-black" :class="{'icon-ui-checkbox-unchecked': filtered, 'icon-ui-gray': !show}" v-on:click="checkEvent"></a>
            <a title="Mostrar/Ocultar" role="button" class="icon-ui-down link-off-black" :class="{'icon-ui-up': show}" @click="show = !show"></a>
        </div>
    </h4>
    <transition name="fade">
        <nav role="navigation" aria-labelledby="sidenav" v-if="show">
        <fieldset class="fieldset-checkbox">
            <template v-for="(value, idx) in deps">
                <div class="side-nav-link  font-size--6"><input type="checkbox" name="deps" :value="value[0]" v-model="checked" @change="checkDepto">{{value[1]}}</div>
            </template>
        </fieldset>
        </nav>
    </transition>
</div>`;

const FilterDepartment = Vue.extend({
    name: "FilterDepartment",
    data() {
        return {
            deps: [],
            checked: [],
            filtered: false,
            show: true
        };
    },
    watch: {
        departments(departamento: Map<string, string>) {
            if (departamento.size > 0) {
                this.deps = Array.from(departamento).sort((val: any, vel: any) => {
                    if (val[1] === vel[1]) {
                        return 0;
                    }
                    else {
                        return (val[1] > vel[1]) ? 1 : -1;
                    }
                });
                this.checked = this.deps.map((val: any) => val[0]);
                this.$store.dispatch("setFDepartments", departamento);
            }
        }
    },
    computed: {
        ...mapGetters({
            departments: "sales/getDepartments"
        })
    },
    methods: {
        checkEvent(event: any) {
            this.filtered = !this.filtered;
            this.checked = !this.filtered ? this.deps.map((val: any) => val[0]) : [];
            this.$store.dispatch("setFilterDepto", this.checked);
        },
        checkDepto(event: any) {
            this.filtered = this.checked.length < this.deps.length;
            this.$store.dispatch("setFilterDepto", this.checked);
        }
    },
    template
});

export default FilterDepartment;