import axios from 'axios';

interface State {
    status: string;
    company: Map<number, string>;
    category: Map<string, string>;
    data: object[];
    request: object;
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

const CompanyStore = {
    state: {
        status: "NONE",
        company: new Map(),
        category: new Map(),
        data: [],
        request: {}
    },
    mutations: {
        setComStatus(state: State, status: string) {
            state.status = status;
        },
        setComData(state: State, data: object[]){
            state.data = data;
        },
        setCompanies(state: State, companies: object) {
            state.company = new Map();
            Object.keys(companies).forEach((key: string) => (
                state.company.set(parseInt(key, 10), cleanNames(companies[key]))
            ));
        },
        setCategories(state: State, categories: object) {
            state.category = new Map();
            Object.keys(categories).forEach(key => (
                state.category.set(key, categories[key])
            ));
        }
    },
    getters: {
        getCompanies: (state: State): Map<number, string> => {
            return state.company;
        },
        getComData: (state: State): object[] =>  {
            return state.data;
        },
        getCategories: (state: State): Map<string, string> =>  {
            return state.category;
        }
    },
    actions: {
        fetchByCompany(context: any): any {
            if (context.state.status !== "PENDING") {
                context.commit("setComStatus", "PENDING");
                context.state.request = new Promise((resolve, reject) => {
                     axios.get('/api/import/by_company')
                    .then(response => {
                        context.commit("setComStatus", "DONE");
                        context.commit("setComData", response.data.data);
                        context.commit("setCompanies", response.data.distribuidor);
                        context.commit("setCategories", response.data.categoria);
                        resolve();
                    })
                    .catch(error => {
                        context.commit("setComStatus", "ERROR");
                        reject((error.response !== undefined) ? error.response.status : 500);
                    });
                });
            }
            return context.state.request;
        }
    }
};

export default CompanyStore;