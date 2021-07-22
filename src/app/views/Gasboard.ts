import Vue from 'vue';
import { ProductImportGas } from './ProductPie';
import { CountryMap } from './CountryMap';
import { CompanyImportGas } from './CompanyBar';
import { CategoryImportGasTime } from './CategoryBarTime';
import { CategoryImportGasMonths } from './CategoryMonths';
import { PriceImportGasMonths } from './ProductPriceMonth';
import {FilterMonth, FilterCompany, FilterYear, FilterCountry } from '../filters/';
import {CountryImportGas} from './Country';
import Loader from './Loader';


const template = `
<div class="column-24">
    <div class="column-4">
    <aside class="side-nav" >
        <FilterYear />
        <FilterMonth />
        <FilterCountry />
        <FilterCompany/>
    </aside>
    </div>
    <Loader v-if="!loaded && !error"/>
    <div class="column-20" v-if="loaded">
        <h2 class="text-rule">Importación de GLP</h2>
        <div class="column-20 leader-1">
            <CountryMap header="Importación por pais de origen (kg)" xclass="column-8" :styles="{height: '240px'}"/>
            <CountryImportGas header="Importación por país de origen" type="GS" xclass="column-6" :styles="{height: '240px'}"/>
            <ProductImportGas type="GS" header="Importación por tipo" xclass="column-6" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <CategoryImportGasTime header="Importación por Empresa (kg)" type="GS" xclass="column-10" :styles="{height: '240px'}"/>
            <CompanyImportGas header="Importación por Empresa (kg)" type="GS" xclass="column-10" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <CategoryImportGasMonths header="Importación por mes $title (kg)" type="GS" xclass="column-10" :styles="{height: '240px'}"/>
            <PriceImportGasMonths header="Costos de importación por tipo de producto (U$S/kg)" type="GS" xclass="column-10" :styles="{height: '240px'}"/>
        </div>
    </div>
</div>`;

const Gasboard = Vue.extend({
    name: "Gasboard",
    components: {
        ProductImportGas, CountryMap, CompanyImportGas,
        CategoryImportGasTime, CategoryImportGasMonths, PriceImportGasMonths,
        FilterMonth, FilterCompany, FilterCountry, FilterYear, CountryImportGas, Loader
    },
    template,
    data() {
        return {
            loaded: false,
            error: false
        };
    },
    mounted() {
        this.$store.dispatch("setFCountries", new Map([
                            ["AR", "ARGENTINA"],
                            ["BO", "BOLIVIA"]
                        ]));
        this.$store.dispatch("fetchYearRange", "import/gas")
                   .then(() => {this.loaded = true; });
    }
});

export default Gasboard;