import Vue from "vue";

const template: string = `
<div class="footer" role="contentinfo">
  <div class="grid-container">
    <!-- footer section 1 -->
    <div class="column-24"> 
    <hr>
      <div class="column-8">
        <p><span class="icon-ui-globe"></span>Copyright &copy; {{new Date().getFullYear()}} {{copyright}}</p>
      </div>
      <div class="column-16 font-size--2"></div>
    </div>
  </div>
</div>
`;

export default Vue.extend({
    name: "Footer",
    props: {
        copyright: String
    },
    template
});