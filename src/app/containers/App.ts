import Vue from "vue";
import Heading from "./Heading";
import Content from "./Content";
import Footer from "./Footer";

const template: string = `<div class="container">
<div class="wrapper">
  <Heading title="MIC" subtitle="Tablero de Control" /> 
  
  <Content />
  
</div>

<Footer copyright="Ministerio de Industria y Comercio" />
</div>`

const App = Vue.extend({
    name: "App",
    components: {
        Heading, Content, Footer
    },
    data() {
        return {
            message: "Hello World" as string
        }
    },
    methods: {
        handleClick(): void {
            this.message = this.message === "Hello World" ? "Bye" : "Hello World";
        }
    },
    template
});

export default App;