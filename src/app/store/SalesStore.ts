import axios from 'axios';

interface Payload {
    [propName: string]: any;
}

interface State {
    status: string;
    data: Map<string, Payload>;
    producto: Map<string, string>;
    categoria: Map<string, string>;
    departamento: Map<string, string>;
    distribuidor: Map<number, string>;
    requests: Map<string, object>;
}

const SalesStore = {
    namespaced: true,
    state: {
        status: "",
        data: new Map(),
        departamento: new Map(),
        distribuidor: new Map(),
        requests: new Map()
    },
    mutations: {
        setData(state: State, payload: any){
            state.data.set(payload.api, payload.data);
        },
        setProducts(state: State, producto: object) {
            state.producto = new Map();
            Object.keys(producto).forEach(key => (
                state.producto.set(key, producto[key])
            ));
        },
        setCategories(state: State, categoria: object) {
            state.categoria = new Map();
            Object.keys(categoria).forEach(key => (
                state.categoria.set(key, categoria[key])
            ));
        },
        setDepartments(state: State, states: object) {
            state.departamento = new Map();
            Object.keys(states).forEach(key => (
                state.departamento.set(key, states[key])
            ));
        },
        setCompanies(state: State, company: object) {
            state.distribuidor = new Map();
            Object.keys(company).forEach(key => (
                state.distribuidor.set(parseInt(key, 10), company[key])
            ));
        }
    },
    getters: {
        getProducts(state: State): Map<string, string> {
            return state.producto;
        },
        getCategories(state: State): Map<string, string> {
            return state.categoria;
        },
        getDepartments(state: State): Map<string, string>{
            return state.departamento;
        },
        getCompanies(state: State): Map<number, string>{
            return state.distribuidor;
        },
        getData(state: State): any {
            return (api: string) => state.data.get(api);
        }
    },
    actions: {
        fetchByName(context: any, uri: string): any {
            const api = `/api/sales/${uri}`;
            const requests = context.state.requests;
            if (requests.has(api)) {
                return requests.get(api);
            }
            const req = new Promise((resolve, reject) => {
                axios.get(api)
                .then((response) => {
                    context.commit("setData", {
                        api: `sales/${uri}`,
                        data: response.data.data
                    });
                    if (response.data.producto !== undefined) {
                        context.commit("setProducts", response.data.producto);
                    }
                    if (response.data.categoria !== undefined) {
                        context.commit("setCategories", response.data.categoria);
                    }
                    if (response.data.departamento !== undefined) {
                        context.commit("setDepartments", response.data.departamento);
                    }
                    if (response.data.distribuidor !== undefined) {
                        context.commit("setCompanies", response.data.distribuidor);
                    }
                    resolve(response.status);
                    context.state.requests.delete(api);
                })
                .catch((error) => {
                    reject((error.response !== undefined) ? error.response.status : 500);
                    context.state.requests.delete(api);
                });
            });
            requests.set(api, req);
            return req;
        }
    }
};

export default SalesStore;