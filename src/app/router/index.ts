import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '../views/Dashboard';
import Salesboard from '../views/Salesboard';
import Plantsboard from '../views/Plantsboard';
import Gasboard from '../views/Gasboard';


// Views
Vue.use(Router);

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior() {
      return { y: 0, x: 0 };
  },
  routes: [
        {
            path: '/',
            redirect: "dashboard",
            component: {name: "Home", template: "<section></section>"},
        },
        {
            path: '/dashboard',
            name: 'Dashboard',
            component: Dashboard
        },
        {
            path: '/sales',
            name: 'Sales',
            component: Salesboard
        },
        {
            path: '/mix',
            name: 'Sales Plants',
            component: Plantsboard
        },
        {
            path: '/gasboard',
            name: 'Import Gas',
            component: Gasboard
        },
        {
            path: '/salesgas',
            name: 'Sales Gas',
            component: Gasboard
        }
    ]
});