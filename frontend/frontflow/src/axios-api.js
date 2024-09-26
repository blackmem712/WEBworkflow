import axios from "axios";

const getAPI = axios.create({
    baseURL:'http://127.0.0.1:8000',
    
})

export const api = {

    get(endpoint){
        return getAPI.get(endpoint);
    },
    post(endpoint,body){
        return getAPI.post(endpoint, body);

    },
    patch(endpoint, body) {
        return getAPI.patch(endpoint, body);
    },
    delete(endpoint) {
        return getAPI.delete(endpoint);
    },
}
export function getCep(cep) {
    return axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  }
  