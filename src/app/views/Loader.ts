import Vue from 'vue';

const template = `<div class="center-column">
<div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
</div>`


const Loader = Vue.extend({
    name: "Loader",
    template
});

export default Loader;