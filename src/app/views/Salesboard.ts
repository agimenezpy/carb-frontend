import Vue from 'vue';
import { ProductSales } from './Product';
import { CategorySalesTime } from './CategoryTime';
import { CategorySalesMonths } from './CategoryMonths';
import { CompanySales } from './Company';
import { DepartmentSales } from './Department';
import { StationCompany, StationDepartment } from './Station';
import { StationMap } from './StationMap';
import SalesPrice from './SalesPrice';
import { FilterMonth, FilterCompany, FilterDepartment, FilterYear} from '../filters';
import Loader from './Loader';


const template = `
<div class="column-24">
    <div class="column-4">
    <aside class="side-nav">
        <FilterYear />
        <FilterMonth />
        <FilterCompany />
        <FilterDepartment />
    </aside>
    </div>
    <Loader v-if="!loaded && !error"/>
    <div class="column-20" v-if="loaded">
        <h2 class="text-rule">Ventas de combustibles</h2>
        <div class="column-20 leader-1">
            <ProductSales header="Ventas por Producto (litros)" xclass="column-5" :styles="{height: '290px'}"/>
            <CategorySalesTime header="Ventas por Mes $year (millones de litros)" xclass="column-7" :styles="{height: '290px'}"/>
            <div class="column-8">
                <div class="card">
                    <div class="card-content">
                    <StationCompany header="Distribuidora" :styles="{height: '130px'}"/>
                    <StationDepartment header="Departamento" :styles="{height: '130px'}"/>
                    </div>
                </div>
            </div>
        </div>
        <div class="column-20 leader-1">
            <DepartmentSales header="Ventas por Departamento (litros)" xclass="column-6"/>
            <CompanySales header="Ventas por Distribuidora (litros)" xclass="column-6"/>
            <StationMap header="EESS y PCP por Departamento" xclass="column-8"/>
        </div>
        <div class="column-20 leader-1">
            <CategorySalesMonths header="Venta de $title (millones de litros)" type="GL" xclass="column-10" :styles="{height: '240px'}"/>
            <CategorySalesMonths header="Venta de $title (millones de litros)" type="GA" xclass="column-10" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
        <SalesPrice header="Precio de Venta al Público" xclass="column-20" />
        </div>
    </div>
</div>`;

const Salesboard = Vue.extend({
    name: "Salesboard",
    components: {
        ProductSales, CategorySalesTime, CategorySalesMonths, CompanySales, DepartmentSales,
        FilterMonth, FilterCompany, FilterDepartment, FilterYear,
        StationCompany, StationDepartment, StationMap, SalesPrice, Loader
    },
    template,
    data() {
        return {
            loaded: false,
            error: false
        };
    },
    mounted() {
        this.$store.dispatch("fetchYearRange", "sales")
                  .then(() => { this.loaded = true; });
    }
});

export default Salesboard;