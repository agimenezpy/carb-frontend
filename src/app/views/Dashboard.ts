import Vue from 'vue';
import { ProductImport } from './Product';
import { CategoryImport } from './Category';
import {CompanyImport} from './Company';
import { CategoryImportTime } from './CategoryTime';
import { CategoryImportMonths } from './CategoryMonths';
import { PriceImportMonths } from './PriceMonths';
import CategoryYears from './CategoryYears';
import {FilterMonth, FilterCompany, FilterYear } from '../filters/';
import { CountryImport } from './Country';
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
        <h2 class="text-rule">Importación de combustibles</h2>
        <div class="column-20 leader-1">
            <ProductImport header="Importación por Producto (litros)" xclass="column-6" :styles="{height: '240px'}"/>
            <CategoryImport type="GL" header="Importación de $title" xclass="column-7" :styles="{height: '240px'}"/>
            <CategoryImport type="GA" header="Importación de $title" xclass="column-7" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <CompanyImport header="Importación por Empresa (litros)" xclass="column-8" :styles="{height: '240px'}"/>
            <CategoryImportTime header="Importación por Mes $year (litros)" xclass="column-12" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <CategoryImportMonths header="$title (millones de litros)" type="GL" xclass="column-10" :styles="{height: '240px'}"/>
            <CategoryImportMonths header="$title (millones de litros)" type="GA" xclass="column-10" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <CategoryYears header="Importación $title (litros)" xclass="column-10" :styles="{height: '240px'}"/>
            <PriceImportMonths header="Precio $title (dolares/litro)" type="GTA" xclass="column-10" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <PriceImportMonths header="Precio $title (dolares/litro)" type="NV" xclass="column-10" :styles="{height: '240px'}"/>
            <PriceImportMonths header="Precio $title (dolares/litro)" type="N91" xclass="column-10" :styles="{height: '240px'}" />
        </div>
        <div class="column-20 leader-1">
            <CountryImport header="Importación por Origen $title" type="GL" xclass="column-10" :styles="{height: '240px'}"/>
            <CountryImport header="Importación por Origen $title" type="GA" xclass="column-10" :styles="{height: '240px'}"/>
        </div>
    </div>
</div>`;

const Dashboard = Vue.extend({
    name: "Dashboard",
    components: {
        ProductImport, CategoryImport, CompanyImport,
        CategoryImportTime, CategoryImportMonths, CategoryYears, PriceImportMonths,
        FilterMonth, FilterCompany, FilterYear, CountryImport, Loader
    },
    template,
    data() {
        return {
            loaded: false,
            error: false
        };
    },
    mounted() {
        this.$store.dispatch("fetchYearRange", "import")
                   .then(() => {this.loaded = true; });
    }
});

export default Dashboard;