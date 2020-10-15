import Vue from 'vue';
import { ProductSales } from './Product';
import { CategorySalesTime } from './CategoryTime';
import { CategorySalesMonths } from './CategoryMonths';
import { CompanySales } from './Company';
import FilterMonth from './FilterMonth';
import FilterCompany from './FilterCompany';
import FilterDepartment from './FilterDepartment';


const template = `
<div class="column-24">
    <div class="column-5">
    <aside class="side-nav">
        <FilterMonth />
        <FilterCompany />
        <FilterDeparment />
    </aside>
    </div>
    <div class="column-18 pos-1">
        <h2 class="text-rule">Ventas de Combustibles</h2>
        <div class="column-18 leader-1">
            <ProductSales header="Ventas por Productos" :aspect="false" xclass="column-6"/>
            <CategorySalesTime header="Ventas por Mes" xclass="column-12"/>
        </div>
        <div class="column-18 leader-1">
            <CompanySales header="Ventas por Distribuidor" xclass="column-9"/>
        </div>
        <div class="column-18 leader-1">
            <CategorySalesMonths header="Comparación Mensual" type="GL" xclass="column-9"/>
            <CategorySalesMonths header="Comparación Mensual" type="GA" xclass="column-9"/>
        </div>
        <div class="column-18 leader-1">
        </div>
    </div>
</div>`;

const Salesboard = Vue.extend({
    name: "Salesboard",
    components: {
        ProductSales, CategorySalesTime, CategorySalesMonths, CompanySales,
        FilterMonth, FilterCompany, FilterDeparment: FilterDepartment
    },
    template,
    mounted() {
        this.$store.dispatch("sales/fetchByName", "by_category");
    }
});

export default Salesboard;