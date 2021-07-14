import axios from 'axios';

interface State {
    status: string;
    product: Map<string, string>;
    data1: object[];
    data2: object[];
    request: object;
}

const PriceStore = {
    state: {
        status: "NONE",
        product: new Map(),
        data1: {},
        data2: {},
        request: {}
    },
    mutations: {
        setPriStatus(state: State, status: string) {
            state.status = status;
        },
        setPriDataY1(state: State, data: object[]){
            state.data1 = data;
        },
        setPriDataY2(state: State, data: object[]){
            state.data2 = data;
        },
        setPriProducts(state: State, product: object) {
            state.product = new Map();
            Object.keys(product).forEach(key => (
                state.product.set(key, product[key])
            ));
        }
    },
    getters: {
        getPriProducts: (state: State): Map<string, string> => {
            return state.product;
        },
        getPriDataY1: (state: State): object[] =>  {
            return state.data1;
        },
        getPriDataY2: (state: State): object[] =>  {
            return state.data2;
        }
    },
    actions: {
        fetchByPrice(context: any, year: number) {
            if (context.state.status !== "PENDING") {
                context.commit("setPriStatus", "PENDING");
                const ylast = axios.get(`/api/import/by_price/${year - 1}`);
                const yprev = axios.get(`/api/import/by_price/${year}`);
                context.state.request = new Promise((resolve, reject) => {
                    axios.all([ylast, yprev])
                        .then(axios.spread((...responses: any) => {
                            context.commit("setPriStatus", "DONE");
                            context.commit("setPriDataY1", responses[0].data.data);
                            context.commit("setPriDataY2", responses[1].data.data);
                            context.commit("setPriProducts", responses[0].data.producto);
                            resolve({});
                        }))
                        .catch(error => {
                            context.commit("setPriStatus", "ERROR");
                            reject((error.response !== undefined) ? error.response.status : 500);
                        });
                });
            }
            return context.state.request;
        }
    }
};

export default PriceStore;