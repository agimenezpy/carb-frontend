import {mapGetters, mapState} from 'vuex';

const DualFilterUtil = {
    data() {
        return {
            filters: {}
        }
    },
    methods: {
        filterDualData(filters: object, rawData: object[]) {
            let fComp = filters["fComp"];
            let fMonth = filters["fMonth"];
            let months = "";
            if (fMonth !== undefined) {
                let lastDate = rawData[rawData.length - 1]["fecha"];
                let lastYear = parseInt(lastDate.split("-")[0]);
                months = fMonth.map((mItem: string) => this.MONTHS.indexOf(mItem) + 1).join("|")
                months = `${lastYear}-0?(${months})-01`
            }
            return rawData.filter(item => (
                                 ((fMonth !== undefined) ? item["fecha"].match(months) : true) &&
                                  ((fComp !== undefined) ? fComp.indexOf(item["distribuidor"]) >= 0 : true) ));

        },
        filterCompData(filters: object, rawData: object[]) {
            let fComp = filters["fComp"];
            return rawData.filter(item => ((fComp !== undefined) ? fComp.indexOf(item["distribuidor"]) >= 0 : true));
        },
        filterMonthData(filters: object, rawData: object[]) {
            let fMonth = filters["fMonth"];
            let months = "";
            if (fMonth !== undefined) {
                let lastDate = rawData[rawData.length - 1]["fecha"];
                let lastYear = parseInt(lastDate.split("-")[0]);
                months = fMonth.map((mItem: string) => this.MONTHS.indexOf(mItem) + 1).join("|")
                months = `${lastYear}-0?(${months})-01`
            }
            return rawData.filter(item => ((fMonth !== undefined) ? item["fecha"].match(months) : true));
        },
        isEmpty(filter: object) {
            return Object.keys(filter).length == 0;
        }
    },
    watch: {
        month(fMonth: string[]) {
            if (fMonth.length < this.MONTHS.length) {
                this.filters["fMonth"] = fMonth;
            } 
            else {
                this.filters["fMonth"] = undefined;
            }
            this.updateChart(this.filters);
        },
        company(fComp: number[]) {
            if (typeof this.filters["fComp"] == "boolean") {
                return;
            }
            if (fComp.length < this.COMPY.size) {
                this.filters["fComp"] = fComp;
            }
            else {
                this.filters["fComp"] = undefined;
            }
            this.updateChart(this.filters);
        }
    },
    computed: {
        ...mapGetters({
            company:"getFCompany",
            month:"getFMonth"
        }),
        ...mapState({
            MONTHS: (state: any) => state.FilterStore.MONTHS,
            COMPY: (state: any) => state.FilterStore.COMPY
        })
    },
}

export default DualFilterUtil;