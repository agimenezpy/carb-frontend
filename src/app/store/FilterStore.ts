interface State {
    months: string[],
    comps: number[],
    MONTHS: string[],
    COMPY: Map<number, string>
};

const FilterStore = {
    state: {
        months: [],
        comps: [],
        MONTHS: ["Enero", "Febrero", "Marzo", 
                "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Setiembre",
                "Octubre", "Noviembre", "Diciembre"],
        COMPY: new Map()
    },
    mutations: {
        setFMonth(state: State, months: string[]) {
            state.months = months;
        },
        setFComp(state: State, comps: number[]){
            state.comps = comps;
        },
        setFCompanies(state: State, companies: Map<number, string>){
            state.COMPY = companies;
        },
    },
    getters: {
        getFMonth: (state: State): string[] => {
            return state.months;
        },
        getFCompany: (state: State): number[] =>  {
            return state.comps;
        }
    },
    actions: {
        setFilterMonth(context: any, months: string[]) {
            context.commit("setFMonth", months);
        },
        setFilterDist(context: any, dist: string[]) {
            context.commit("setFComp", dist);
        },
        setFCompanies(context: any, companies: Map<number, string>) {
            context.commit("setFCompanies", companies);
        }
    }
};

export default FilterStore;