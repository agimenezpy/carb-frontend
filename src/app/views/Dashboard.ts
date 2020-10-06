import Vue from 'vue';
import Product from './Product';
import Category from './Category';
import 'chartjs-plugin-colorschemes';


const template = `<div class="section">
<h2 class="text-rule">Importación de combustibles</h2>
<div class="block-group block-group-3-up">
    <Product header="Importación por productos"/>
    <Category type="GL" header="Importación de Gasoil"/>
    <Category type="GA" header="Importación de Nafta"/>
</div>
</div>`

const Dashboard = Vue.extend({
    name: "Dashboard",
    components: {
        Product, Category
    },
    template
});

export default Dashboard;