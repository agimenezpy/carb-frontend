import Vue from 'vue';
import { ProductImport } from './Product';
import Category from './Category';
import {CompanyImport} from './Company';
import { CategoryImportTime } from './CategoryTime';
import { CategoryImportMonths } from './CategoryMonths';
import CategoryYears from './CategoryYears';
import FilterMonth from './FilterMonth';
import FilterCompany from './FilterCompany';


const template = `
<div class="column-24">
    <div class="column-5">
    <aside class="side-nav">
        <FilterMonth />
        <FilterCompany />
    </aside>
    </div>
    <div class="column-18 pos-1">
        <h2 class="text-rule">Importación de combustibles</h2>
        <div class="column-18 leader-1">
            <ProductImport header="Importación por Productos" :aspect="true" xclass="column-6"/>
            <Category type="GL" header="Porcentaje" :aspect="true" xclass="column-6"/>
            <Category type="GA" header="Porcentaje" :aspect="true" xclass="column-6"/>
        </div>
        <div class="column-18 leader-1">
            <CompanyImport header="Importación por Empresas" xclass="column-6"/>
            <CategoryImportTime header="Importación por Mes" xclass="column-12"/>
        </div>
        <div class="column-18 leader-1">
            <CategoryImportMonths header="Comparación Mensual" type="GL" xclass="column-12"/>
            <CategoryYears header="Comparación Anual" type="GL" xclass="column-6"/>
        </div>
        <div class="column-18 leader-1">
            <CategoryImportMonths header="Comparación Mensual" type="GA" xclass="column-12"/>
            <CategoryYears header="Comparación Anual" type="GA" xclass="column-6"/>
        </div>
    </div>
</div>`;

const Dashboard = Vue.extend({
    name: "Dashboard",
    components: {
        ProductImport, Category, CompanyImport,
        CategoryImportTime, CategoryImportMonths, CategoryYears,
        FilterMonth, FilterCompany
    },
    template
});

export default Dashboard;