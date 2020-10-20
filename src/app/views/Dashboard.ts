import Vue from 'vue';
import { ProductImport } from './Product';
import Category from './Category';
import {CompanyImport} from './Company';
import { CategoryImportTime } from './CategoryTime';
import { CategoryImportMonths } from './CategoryMonths';
import { PriceImportMonths } from './PriceMonths';
import CategoryYears from './CategoryYears';
import FilterMonth from './FilterMonth';
import FilterCompany from './FilterCompany';


const template = `
<div class="column-24">
    <div class="column-4">
    <aside class="side-nav">
        <FilterMonth />
        <FilterCompany />
    </aside>
    </div>
    <div class="column-20">
        <h2 class="text-rule">Importación de combustibles</h2>
        <div class="column-20 leader-1">
            <ProductImport header="Importación por Producto (litros)" xclass="column-6" :styles="{height: '240px'}"/>
            <Category type="GL" header="Importación de $title vs OTROS" xclass="column-7" :styles="{height: '240px'}"/>
            <Category type="GA" header="Importación de $title vs OTROS" xclass="column-7" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <CompanyImport header="Importación por Empresa (litros)" xclass="column-8" :styles="{height: '240px'}"/>
            <CategoryImportTime header="Importación por Mes $year (litros)" xclass="column-12" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <CategoryImportMonths header="$title (millones de litros)" type="GL" xclass="column-7" :styles="{height: '240px'}"/>
            <CategoryImportMonths header="$title (millones de litros)" type="GA" xclass="column-7" :styles="{height: '240px'}"/>
            <CategoryYears header="Importación $title (litros)" xclass="column-6" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <PriceImportMonths header="Precio $title (dolares)" type="GTI" xclass="column-10" :styles="{height: '240px'}"/>
            <PriceImportMonths header="Precio $title (dolares)" type="NV" xclass="column-10" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <PriceImportMonths header="Precio $title (dolares)" type="N91" xclass="column-10" :styles="{height: '240px'}" />
        </div>
    </div>
</div>`;

const Dashboard = Vue.extend({
    name: "Dashboard",
    components: {
        ProductImport, Category, CompanyImport,
        CategoryImportTime, CategoryImportMonths, CategoryYears, PriceImportMonths,
        FilterMonth, FilterCompany
    },
    template
});

export default Dashboard;