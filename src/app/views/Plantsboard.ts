import Vue from 'vue';
import { CompanyShare } from './CompanyShare';
import { CategorySalesMix } from './Category';
import { ProductSalesMix } from './Product';
import { CategorySalesMTime } from './CategoryTime';
import { CategorySalesMMonths } from './CategoryMonths';
import { ClientMixer } from './ClientMixer';
import { CompanyMixer } from './CompanyMixer';
import { MonthsMixer } from './MonthsMixer';
import { FilterMonth, FilterCompany, FilterYear} from '../filters';
import Loader from './Loader';


const template = `
<div class="column-24">
    <div class="column-4">
    <aside class="side-nav">
        <FilterYear />
        <FilterMonth />
        <FilterCompany />
    </aside>
    </div>
    <Loader v-if="!loaded && !error"/>
    <div class="column-20 " v-if="loaded">
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
            <MonthsMixer header="Ventas por mes por productos (millones de litros)" xclass="column-7" :styles="{height: '500px'}"/>
            <CompanyMixer header="Ventas de combustible por mezcladoras (millones de litros)" xclass="column-7" :styles="{height: '500px'}"/>
            <ClientMixer header="Ventas de combustible por destino (millones de litros)" xclass="column-6" :styles="{height: '480px'}"/>
        </div>
        <div class="column-20 leader-1">
            <CategorySalesMMonths header="Venta de $title (millones de litros)" type="GL" xclass="column-10" :styles="{height: '240px'}"/>
            <CategorySalesMMonths header="Venta de $title (millones de litros)" type="GA" xclass="column-10" :styles="{height: '240px'}"/>
        </div>
    </div>
</div>`;

const Plantsboard = Vue.extend({
    name: "Plantsboard",
    components: {
        CompanyShare, CategorySalesMix, ProductSalesMix, CategorySalesMTime,
        ClientMixer, CompanyMixer, MonthsMixer, CategorySalesMMonths,
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
        this.$store.dispatch("fetchYearRange", "salesm")
                   .then(() => { this.loaded = true; });
    }
});

export default Plantsboard;