import Vue from 'vue';
import { ProductSales } from './Product';
import { CategorySalesTime } from './CategoryTime';
import { CategorySalesMonths } from './CategoryMonths';
import { CompanySales } from './Company';
import { DepartmentSales } from './Department';
import { StationCompany, StationDepartment } from './Station';
import { StationMap } from './StationMap';
import FilterMonth from './FilterMonth';
import FilterCompany from './FilterCompany';
import FilterDepartment from './FilterDepartment';


const template = `
<div class="column-24">
    <div class="column-4">
    <aside class="side-nav">
        <FilterMonth />
        <FilterCompany />
        <FilterDepartment />
    </aside>
    </div>
    <div class="column-20">
        <h2 class="text-rule">Ventas de combustibles</h2>
        <div class="column-20 leader-1">
            <ProductSales header="Ventas por Productos" xclass="column-4" :styles="{height: '240px'}"/>
            <CategorySalesTime header="Meses" xclass="column-8" :styles="{height: '240px'}"/>
            <StationMap header="EESS y PCP por Departamento" xclass="column-8" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <DepartmentSales header="Ventas por Departamentos" xclass="column-6"/>
            <CompanySales header="Ventas por Distribuidores" xclass="column-6"/>
            <div class="column-8">
            <StationCompany header="EESS y PCP por Distribuidor" xclass="column-8 trailer-1" :styles="{height: '145px'}"/>
            <StationDepartment header="EESS y PCP por Departamento" xclass="column-8 " :styles="{height: '145px'}"/>
            </div>
        </div>
        <div class="column-20 leader-1">
            <CategorySalesMonths header="Ventas por Años" type="GL" xclass="column-8" :styles="{height: '240px'}"/>
            <CategorySalesMonths header="Ventas por Años" type="GA" xclass="column-8" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
        </div>
    </div>
</div>`;

const Salesboard = Vue.extend({
    name: "Salesboard",
    components: {
        ProductSales, CategorySalesTime, CategorySalesMonths, CompanySales, DepartmentSales,
        FilterMonth, FilterCompany, FilterDepartment, StationCompany, StationDepartment, StationMap
    },
    template,
    mounted() {
        this.$store.dispatch("sales/fetchByName", "by_category");
    }
});

export default Salesboard;