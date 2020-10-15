import Vue from 'vue';
import Vuex from 'vuex';
import ProductStore from './ProductStore';
import CategoryStore from './CategoryStore';
import CompanyStore from './CompanyStore';
import MonthStore from './MonthStore';
import FilterStore from './FilterStore';
import SalesStore from './SalesStore';

Vue.use(Vuex);

const modules = {ProductStore, CategoryStore, CompanyStore, MonthStore, FilterStore, sales: SalesStore};

const Store = new Vuex.Store({
    modules
});

export default Store;