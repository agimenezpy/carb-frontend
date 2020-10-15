import axios from 'axios';

interface State {
    status: string;
    producto: Map<string, string>;
    data: object[];
}

const ProductStore = {
    state: {
        status: "NONE",
        producto: new Map(),
        data: []
    },
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
        getProducts: (state: State): Map<string, string> => {
            return state.producto;
        },
        getProdData: (state: State): object[] =>  {
            return state.data;
        }
    },
    actions: {
        fetchByProduct(context: any): any {
            context.commit("setPrStatus", "PENDING");
            const request = axios.get('/api/import/by_product')
            .then(response => {
                context.commit("setPrStatus", "DONE");
                context.commit("setPrData", response.data.data);
                context.commit("setProducts", response.data.producto);
            })
            .catch(errors => {
                context.commit("setPrStatus", "ERROR");
            });
            return request;
        }
    }
};

export default ProductStore;