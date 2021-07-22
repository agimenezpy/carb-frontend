import Vue from 'vue';
import { CompanySalesGas } from './CompanyBar';
import { CategorySalesGasTime } from './CategoryBarTime';
import { CategorySalesGasMonths } from './CategoryMonths';
import {FilterMonth, FilterCompany, FilterYear } from '../filters/';
import Loader from './Loader';


const template = `
<div class="column-24">
    <div class="column-4">
    <aside class="side-nav" >
        <FilterYear />
        <FilterMonth />
        <FilterCompany/>
    </aside>
    </div>
    <Loader v-if="!loaded && !error"/>
    <div class="column-20" v-if="loaded">
        <h2 class="text-rule">Importación de GLP</h2>
        <div class="column-20 leader-1">
            <div class="column-10">
                <CategorySalesGasTime header="Venta Total por mes (kg)" type="GS" xclass="column-10" :styles="{height: '240px'}"/>
                <CategorySalesGasMonths header="Venta $title (kg)" type="GS" xclass="column-10 leader-1" :styles="{height: '240px'}"/>
            </div>
            <CompanySalesGas header="Venta Total por empresa (kg)" type="GS" xclass="column-10" :styles="{height: '555px'}"/>
        </div>
    </div>
</div>`;

const SalesGasboard = Vue.extend({
    name: "SaleGasboard",
    components: {
        CompanySalesGas, CategorySalesGasTime, CategorySalesGasMonths,
        FilterMonth, FilterCompany, FilterYear, Loader
    },
    template,
    data() {
        return {
            loaded: false,
            error: false
        };
    },
    mounted() {
        this.$store.dispatch("fetchYearRange", "sales/gas")
                   .then(() => {this.loaded = true; });
    }
});

export default SalesGasboard;