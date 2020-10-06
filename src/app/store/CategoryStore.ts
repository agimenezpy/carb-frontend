import axios from 'axios';

interface State {
    status: string,
    category: Map<String, String>,
    data: object[],
    request: object
};

const CategoryStore = {
    state: {
        status: "NONE",
        category: new Map(),
        data: [],
        request: {}
    },
    mutations: {
        setCatStatus(state: State, status: string) {
            state.status = status;
        },
        setCatData(state: State, data: object[]){
            state.data = data;
        },
        setCategories(state: State, category: object) {
            state.category = new Map();
            Object.keys(category).forEach(key => (
                state.category.set(key, category[key])
            ));
        }
    },
    getters: {
        getCategories: (state: State): Map<String, String> => {
            return state.category;
        },
        getCatData: (state: State): object[] =>  {
            return state.data;
        }
    },
    actions: {
        fetchByCategory(context: any) {
            if (context.state.status !== "PENDING") {
                context.commit("setCatStatus", "PENDING");
                context.state.request = axios.get('api/import/by_category')
                .then(response => {
                    context.commit("setCatStatus", "DONE");
                    context.commit("setCatData", response.data.data);
                    context.commit("setCategories", response.data.categoria);
                });
            }
            return context.state.request;
        }
    }
};

export default CategoryStore;