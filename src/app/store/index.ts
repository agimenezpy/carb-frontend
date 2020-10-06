import Vue from 'vue';
import Vuex from 'vuex';
import ProductStore from './ProductStore';
import CategoryStore from './CategoryStore';

Vue.use(Vuex);

const modules = {ProductStore, CategoryStore};

const Store = new Vuex.Store({
    modules
});

export default Store;