import axios from 'axios';

interface State {
    status: string,
    producto: Map<String, String>,
    data: object[]
};

const state = {
    status: "NONE",
    producto: new Map(),
    data: []
};

const ProductStore = {
    state,
    mutations: {
        setPrStatus(state: State, status: string) {
            state.status = status;
        },
        setPrData(state: State, data: object[]){
            state.data = data;
        },
        setProducts(state: State, producto: object) {
            state.producto = new Map();
            Object.keys(producto).forEach(key => (
                state.producto.set(key, producto[key])
            ));
        }

    },
    getters: {
        getProducts: (state: State): Map<String, String> => {
            return state.producto;
        },
        getProdData: (state: State): object[] =>  {
            return state.data;
        }
    },
    actions: {
        fetchByProduct(context: any): any {
            context.commit("setPrStatus", "PENDING");
            const request = axios.get('api/import/by_product')
            .then(response => {
                context.commit("setPrStatus", "DONE");
                context.commit("setPrData", response.data.data);
                context.commit("setProducts", response.data.producto);
            });
            return request;
        }
    }
};

export default ProductStore;