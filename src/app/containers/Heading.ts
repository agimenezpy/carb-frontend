import Vue from "vue";

const template: string = "#heading-template";

export default Vue.extend({
    name: "Heading" as string,
    props: {
        title: {
            type: String,
            default: "This is a title"
        },
        subtitle: String
    },
    template
});