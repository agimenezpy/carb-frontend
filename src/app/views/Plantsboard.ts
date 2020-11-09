import Vue from 'vue';
import { CompanyShare } from './CompanyShare';
import { CategorySalesMix } from './Category';
import { ProductSalesMix } from './Product';
import { CategorySalesMTime } from './CategoryTime';
import { ClientMixer } from './ClientMixer';
import { CompanyMixer } from './CompanyMixer';
import { MonthsMixer } from './MonthsMixer';
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
    <div class="column-20 ">
        <h2 class="text-rule">Mezcladoras - Ventas de combustibles</h2>
        <div class="column-20 leader-1">
            <CompanyShare header="Participación en venta $title de combustibles (%)" type="TOTAL" xclass="column-6" :styles="{height: '300px'}"/>
            <CompanyShare header="Participación en venta de $title (%)" type="GL" xclass="column-7" :styles="{height: '300px'}"/>
            <CompanyShare header="Participación en venta de $title (%)" type="GA" xclass="column-7" :styles="{height: '300px'}"/>
        </div>
        <div class="column-20 leader-1">
            <ProductSalesMix header="Ventas por Producto (millones de litros)" xclass="column-6" :styles="{height: '240px'}"/>
            <CategorySalesMix type="TOTAL" header="Venta de $title (%)" xclass="column-6" :styles="{height: '240px'}"/>
            <CategorySalesMTime header="Ventas por Mes $year (millones de litros)" xclass="column-8" :styles="{height: '240px'}"/>
        </div>
        <div class="column-20 leader-1">
            <MonthsMixer header="Ventas por mes por produtos (millones de litros)" xclass="column-7" :styles="{height: '500px'}"/>
            <CompanyMixer header="Ventas de combustible por mezcladoras (millones de litros)" xclass="column-7" :styles="{height: '500px'}"/>
            <ClientMixer header="Ventas de combustible por destino (millones de litros)" xclass="column-6" :styles="{height: '480px'}"/>
        </div>
    </div>
</div>`;

const Plantsboard = Vue.extend({
    name: "Plantsboard",
    components: {
        CompanyShare, CategorySalesMix, ProductSalesMix, CategorySalesMTime,
        ClientMixer, CompanyMixer, MonthsMixer,
        FilterMonth, FilterCompany
    },
    template
});

export default Plantsboard;