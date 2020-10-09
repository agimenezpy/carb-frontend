import Vue from "vue";
import App from "./containers/App";
import router from "./router";
import store from "./store";
import * as calcite from "calcite-web";
import 'chartjs-plugin-colorschemes';
import 'chartjs-plugin-datalabels';

const el: string = '#app';
const template: string = "<App />";
const components = { App };

(() => new Vue({
    el, template, components, router, store,
    mounted() {
        calcite.init();
    }
}))();