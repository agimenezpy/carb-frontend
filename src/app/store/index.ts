import Vue from 'vue';
import Vuex from 'vuex';
import ProductStore from './ProductStore';
import CompanyStore from './CompanyStore';
import MonthStore from './MonthStore';
import FilterStore from './FilterStore';
import SalesStore from './SalesStore';
import PriceStore from './PriceStore';
import ImportStore from './ImportStore';

Vue.use(Vuex);

const modules = {ProductStore, PriceStore, CompanyStore, MonthStore, FilterStore, sales: SalesStore, imports: ImportStore};

const Store = new Vuex.Store({
    modules
});

export default Store;