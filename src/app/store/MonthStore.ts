import axios from 'axios';

interface State {
    status: string,
    category: Map<string, string>,
    data1: object[],
    data2: object[],
    request: object
};

const MonthStore = {
    state: {
        status: "NONE",
        category: new Map(),
        data: new Map(),
        request: {}
    },
    mutations: {
        setMStatus(state: State, status: string) {
            state.status = status;
        },
        setMDataY1(state: State, data: object[]){
            state.data1 = data;
        },
        setMDataY2(state: State, data: object[]){
            state.data2 = data;
        },
        setMCategories(state: State, category: object) {
            state.category = new Map();
            Object.keys(category).forEach(key => (
                state.category.set(key, category[key])
            ));
        }
    },
    getters: {
        getMCategories: (state: State): Map<string, string> => {
            return state.category;
        },
        getMDataY1: (state: State): object[] =>  {
            return state.data1;
        },
        getMDataY2: (state: State): object[] =>  {
            return state.data2;
        }
    },
    actions: {
        fetchByMonth(context: any) {
            if (context.state.status !== "PENDING") {
                const year = 2020; // (new Date()).getFullYear();
                context.commit("setMStatus", "PENDING");
                const ylast = axios.get(`/api/import/by_month/${year - 1}`);
                const yprev = axios.get(`/api/import/by_month/${year}`);
                context.state.request = axios.all([ylast, yprev])
                    .then(axios.spread((...responses: any) => {
                        context.commit("setMStatus", "DONE");
                        context.commit("setMDataY1", responses[0].data.data);
                        context.commit("setMDataY2", responses[1].data.data);
                        context.commit("setMCategories", responses[0].data.categoria);
                    })
                )
                .catch(errors => {
                    context.commit("SetMStatus", "ERROR");
                });
            }
            return context.state.request;
        }
    }
};

export default MonthStore;