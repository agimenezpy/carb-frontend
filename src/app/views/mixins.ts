import {mapGetters, mapState} from 'vuex';

export interface FilterObj {
    [propName: string] : any;
}

export interface Record {
    [propName: string] : any;
}

function cleanNames(item: string): any {
    let result = item;
    const regex = / (PARAGUAY|SACIA|SAECA|SAE|SRL|SA)/gi;
    result = result.replace(regex, "")
                   .replace(/.* \(([A-Za-z ]+)\)/gi, "\$1")
                   .replace(/([A-Za-z]+)CARBUROS DEL ([A-Za-z]+)/gi, "\$1\$2")
                   .replace(/COMBUSTIBLES ([A-Za-z]+) .*/gi, "\$1")
                   .replace("DISTRIBUIDOR", "")
                   .replace(" ENERGY", "");
    return result;
}

function cleanProducts(item: string): string {
    return item.replace("SIN ALCOHOL", "S/A").replace("CON ALCOHOL", "C/A");
}

const FilterUtil = {
    data() {
        return {
            filters: {}
        };
    },
    methods: {
        filterData(filters: FilterObj, rawData: Record[]) {
            const fComp = filters.fComp;
            const fMonth = filters.fMonth;
            const fDepto = filters.fDepto;
            let months = "";
            if (fMonth !== undefined) {
                const lastDate = rawData[rawData.length - 1].fecha;
                const lastYear = parseInt(lastDate.split("-")[0], 10);
                months = `${lastYear}-0?(${fMonth.join("|")})-01`;
            }
            return rawData.filter(item => (
                                 ((fMonth !== undefined) ? item.fecha.match(months) : true) &&
                                  ((fComp !== undefined) ? fComp.indexOf(item.distribuidor) >= 0 : true)) &&
                                  ((fDepto !== undefined) ? fDepto.indexOf(item.departamento) >= 0 : true));

        },
        filterDualData(filters: FilterObj, rawData: Record[]) {
            const fComp = filters.fComp;
            const fMonth = filters.fMonth;
            let months = "";
            if (fMonth !== undefined) {
                const lastDate = rawData[rawData.length - 1].fecha;
                const lastYear = parseInt(lastDate.split("-")[0], 10);
                months = `${lastYear}-0?(${fMonth.join("|")})-01`;
            }
            return rawData.filter(item => (
                                 ((fMonth !== undefined) ? item.fecha.match(months) : true) &&
                                  ((fComp !== undefined) ? fComp.indexOf(item.distribuidor) >= 0 : true)));

        },
        filterCompData(filters: FilterObj, rawData: Record[]) {
            const fComp = filters.fComp;
            return rawData.filter(item => ((fComp !== undefined) ? fComp.indexOf(item.distribuidor === 2 ? 16 : item.distribuidor) >= 0 : true));
        },
        filterMonthData(filters: FilterObj, rawData: Record[]) {
            const fMonth = filters.fMonth;
            let months = "";
            if (fMonth !== undefined) {
                const lastDate = rawData[rawData.length - 1].fecha;
                const lastYear = parseInt(lastDate.split("-")[0], 10);
                months = `${lastYear}-0?(${fMonth.join("|")})-01`;
            }
            return rawData.filter(item => ((fMonth !== undefined) ? item.fecha.match(months) : true));
        },
        isEmpty(filter: object) {
            return Object.keys(filter).length === 0;
        }
    }
};

const WatchMonth = {
    watch: {
        month(fMonth: string[]) {
            this.filters.fMonth = undefined;
            if (fMonth.length < this.MONTHS.length) {
                this.filters.fMonth = fMonth;
            }
            this.updateChart(this.filters);
        }
    },
    computed: {
        ...mapGetters({
            month: "getFMonth",
        }),
        ...mapState({
            MONTHS: (state: any) => state.FilterStore.MONTHS
        })
    },
};

const WatchComp = {
    watch: {
        company(fComp: number[]) {
            this.filters.fComp = undefined;
            if (fComp.length < this.COMPY.size) {
                this.filters.fComp = fComp;
            }
            this.updateChart(this.filters);
        }
    },
    computed: {
        ...mapGetters({
            company: "getFCompany"
        }),
        ...mapState({
            COMPY: (state: any) => state.FilterStore.COMPY
        })
    }
};

const WatchDepto = {
    watch: {
        department(fDepto: number[]) {
            this.filters.fDepto = undefined;
            if (fDepto.length < this.DPTOPY.size) {
                this.filters.fDepto = fDepto;
            }
            this.updateChart(this.filters);
        }
    },
    computed: {
        ...mapGetters({
            department: "getFDepto"
        }),
        ...mapState({
            DPTOPY: (state: any) => state.FilterStore.DPTOPY
        })
    }
};

export {
    FilterUtil, WatchMonth, WatchComp, WatchDepto, cleanNames, cleanProducts
};