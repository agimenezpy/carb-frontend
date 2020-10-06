import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from '../views/Dashboard';

// Views
Vue.use(Router)

export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior() {
      return { y: 0, x: 0 }
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
        }
    ]
});