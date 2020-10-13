import {mapGetters, mapState} from 'vuex';

export interface FilterObj {
    fComp: number[] | undefined,
    fMonth: string[] | undefined
}

export interface Record {
    [propName: string] : any
}

const DualFilterUtil = {
    data() {
        return {
            filters: {}
        }
    },
    methods: {
        filterDualData(filters: FilterObj, rawData: Record[]) {
            const fComp = filters.fComp;
            const fMonth = filters.fMonth;
            let months = "";
            if (fMonth !== undefined) {
                const lastDate = rawData[rawData.length - 1].fecha;
                const lastYear = parseInt(lastDate.split("-")[0], 10);
                months = fMonth.map((mItem: string) => this.MONTHS.indexOf(mItem) + 1).join("|")
                months = `${lastYear}-0?(${months})-01`
            }
            return rawData.filter(item => (
                                 ((fMonth !== undefined) ? item.fecha.match(months) : true) &&
                                  ((fComp !== undefined) ? fComp.indexOf(item.distribuidor) >= 0 : true)));

        },
        filterCompData(filters: FilterObj, rawData: Record[]) {
            const fComp = filters.fComp;
            return rawData.filter(item => ((fComp !== undefined) ? fComp.indexOf(item.distribuidor) >= 0 : true));
        },
        filterMonthData(filters: FilterObj, rawData: Record[]) {
            const fMonth = filters.fMonth;
            let months = "";
            if (fMonth !== undefined) {
                const lastDate = rawData[rawData.length - 1].fecha;
                const lastYear = parseInt(lastDate.split("-")[0], 10);
                months = fMonth.map((mItem: string) => this.MONTHS.indexOf(mItem) + 1).join("|")
                months = `${lastYear}-0?(${months})-01`
            }
            return rawData.filter(item => ((fMonth !== undefined) ? item.fecha.match(months) : true));
        },
        isEmpty(filter: object) {
            return Object.keys(filter).length === 0;
        }
    },
    watch: {
        month(fMonth: string[]) {
            this.filters.fMonth = undefined;
            if (fMonth.length < this.MONTHS.length) {
                this.filters.fMonth = fMonth;
            }
            this.updateChart(this.filters);
        },
        company(fComp: number[]) {
            if (typeof this.filters.fComp === "boolean") {
                return;
            }
            this.filters.fComp = undefined;
            if (fComp.length < this.COMPY.size) {
                this.filters.fComp = fComp;
            }
            this.updateChart(this.filters);
        }
    },
    computed: {
        ...mapGetters({
            company: "getFCompany",
            month: "getFMonth"
        }),
        ...mapState({
            MONTHS: (state: any) => state.FilterStore.MONTHS,
            COMPY: (state: any) => state.FilterStore.COMPY
        })
    },
}

export {
    DualFilterUtil
};