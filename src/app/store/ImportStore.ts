import axios from 'axios';

interface Payload {
    [propName: string]: any;
}

interface State {
    status: string;
    data: Map<string, Payload>;
    producto: Map<string, string>;
    categoria: Map<string, string>;
    pais: Map<string, string>;
    distribuidor: Map<number, string>;
    requests: Map<string, object>;
}

function cleanNames(item: string): any {
    let result = item;
    const regex = / (PARAGUAY|SACIA|SAECA|SAE|SRL|SA)/gi;
    result = result.replace(regex, "")
                   .replace(/.* \(([A-Za-z ]+)\)/gi, "\$1")
                   .replace(/([A-Za-z]+)CARBUROS DEL ([A-Za-z]+)/gi, "\$1\$2")
                   .replace(/COMBUSTIBLES ([A-Za-z]+) .*/gi, "\$1")
                   .replace("DISTRIBUIDOR", "");
    return result;
}

const ImportStore = {
    namespaced: true,
    state: {
        status: "",
        data: new Map(),
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
        setCountry(state: State, countries: object) {
            state.pais = new Map();
            Object.keys(countries).forEach(key => (
                state.pais.set(key, countries[key])
            ));
        },
        setCompanies(state: State, company: object) {
            const original = new Map();
            Object.keys(company).map((key: string) => (original.set(parseInt(key, 10), cleanNames(company[key]))));
            state.distribuidor = new Map(
                Array.from(
                    original.entries()
                ).sort((a, b) => (a[1] > b[1]) ? 1 : -1)
            );
        }
    },
    getters: {
        getProducts(state: State): Map<string, string> {
            return state.producto;
        },
        getCategories(state: State): Map<string, string> {
            return state.categoria;
        },
        getCountries(state: State): Map<string, string>{
            return state.pais;
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
            const api = `import/${uri}`;
            const requests = context.state.requests;
            if (requests.has(api)) {
                return requests.get(api);
            }
            const req = new Promise((resolve, reject) => {
                axios.get("/api/" + api)
                .then((response) => {
                    context.commit("setData", {
                        api,
                        data: response.data.data
                    });
                    if (response.data.producto !== undefined) {
                        context.commit("setProducts", response.data.producto);
                    }
                    if (response.data.categoria !== undefined) {
                        context.commit("setCategories", response.data.categoria);
                    }
                    if (response.data.pais !== undefined) {
                        context.commit("setCountry", response.data.pais);
                    }
                    if (response.data.distribuidor !== undefined) {
                        context.commit("setCompanies", response.data.distribuidor);
                    }
                    resolve();
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

export default ImportStore;