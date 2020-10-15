interface State {
    months: number[];
    comps: number[];
    depto: string[];
    MONTHS: string[];
    COMPY: Map<number, string>;
    DPTOPY: Map<string, string>;
}

const FilterStore = {
    state: {
        months: [],
        comps: [],
        depto: [],
        MONTHS: ["Enero", "Febrero", "Marzo",
                "Abril", "Mayo", "Junio",
                "Julio", "Agosto", "Setiembre",
                "Octubre", "Noviembre", "Diciembre"],
        COMPY: new Map(),
        DPTOPY: new Map(),
    },
    mutations: {
        setFMonth(state: State, months: number[]) {
            state.months = months;
        },
        setFComp(state: State, comps: number[]){
            state.comps = comps;
        },
        setFDepto(state: State, depto: string[]){
            state.depto = depto;
        },
        setFCompanies(state: State, companies: Map<number, string>){
            state.COMPY = companies;
        },
        setFDepartments(state: State, departments: Map<string, string>){
            state.DPTOPY = departments;
        },
    },
    getters: {
        getFMonth: (state: State): number[] => {
            return state.months;
        },
        getFCompany: (state: State): number[] =>  {
            return state.comps;
        },
        getFDepto: (state: State): string[] =>  {
            return state.depto;
        }
    },
    actions: {
        setFilterMonth(context: any, months: number[]) {
            context.commit("setFMonth", months);
        },
        setFilterDist(context: any, dist: number[]) {
            context.commit("setFComp", dist);
        },
        setFilterDepto(context: any, depto: string[]) {
            context.commit("setFDepto", depto);
        },
        setFCompanies(context: any, companies: Map<number, string>) {
            context.commit("setFCompanies", companies);
        },
        setFDepartments(context: any, departments: Map<number, string>) {
            context.commit("setFDepartments", departments);
        }
    }
};

export default FilterStore;