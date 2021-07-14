import axios from 'axios';

interface State {
    page: string;
    year: number;
    years: number[];
    request: object;
}

const PageStore = {
    state: {
        page: "",
        year: -1,
        years: [0, 0]
    },
    mutations: {
        setPage(state: State, page: string) {
            state.page = page;
        },
        setYear(state: State, year: number) {
            state.year = (year > state.years[state.years.length - 1]) ? state.years[state.years.length - 1] : state.year = year;
        },
        setYears(state: State, years: number[]) {
            state.years = years;
        }
    },
    getters: {
        getPage: (state: State): string => {
            return state.page;
        },
        getYears: (state: State): number[] =>  {
            return state.years;
        },
        getYear: (state: State): number =>  {
            return state.year;
        }
    },
    actions: {
        fetchYearRange(context: any, page: string): any {
            context.commit("setPage", page);
            context.state.request = new Promise((resolve, reject) => {
                axios.get(`/api/${page}/get_range`)
                .then(response => {
                    context.commit("setYears", response.data.years);
                    if (context.state.year < 1) {
                        context.commit("setYear", response.data.default);
                    }
                    resolve({});
                })
                .catch(error => {
                    reject((error.response !== undefined) ? error.response.status : 500);
                });
            });

            return context.state.request;
        },
        setDefaultYear(context: any, year: number) {
            context.commit("setYear", year);
        }
    }
};

export default PageStore;