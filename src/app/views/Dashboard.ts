import Vue from 'vue';
import Product from './Product';
import Category from './Category';
import Company from './Company';
import CategoryTime from './CategoryTime';
import CategoryMonths from './CategoryMonths';
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
            <Product header="Importación por Productos" xclass="column-6"/>
            <Category type="GL" header="Porcentaje" xclass="column-6"/>
            <Category type="GA" header="Porcentaje"  xclass="column-6"/>
        </div>
        <div class="column-18 leader-1">
            <Company header="Importación por Empresas" xclass="column-6"/>
            <CategoryTime header="Importación Mensual" xclass="column-12"/>
        </div>
        <div class="column-18 leader-1">
            <CategoryMonths header="Comparación Mensual" type="GL" xclass="column-12"/>
            <CategoryYears header="Comparación Anual" type="GL" xclass="column-6"/>
        </div>
        <div class="column-18 leader-1">
            <CategoryMonths header="Comparación Mensual" type="GA" xclass="column-12"/>
            <CategoryYears header="Comparación Anual" type="GA" xclass="column-6"/>
        </div>
    </div>
</div>`

const Dashboard = Vue.extend({
    name: "Dashboard",
    components: {
        Product, Category, Company,
        CategoryTime, CategoryMonths, CategoryYears,
        FilterMonth, FilterCompany
    },
    template
});

export default Dashboard;