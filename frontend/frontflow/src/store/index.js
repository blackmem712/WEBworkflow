import { createStore } from 'vuex'; // Importar createStore do Vuex
import { api } from '../axios-api.js';

export default createStore({
  state() {
    return {
      verificarcampos: false,
      login: false,
      cliente: {
        nome: "",
        cpf: "",
        email: "",
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        telefone: ""
      }
    };
  },
  mutations: {
    UPDATE_CLIENTE(state, payload) {
      state.cliente = Object.assign(state.cliente, payload);
    },
  },
  actions: {
    async criarUsuario(context, payload) {
      context.commit("UPDATE_CLIENTE", { id: payload.id });
      try {
        const response = await api.post("/pessoas/api/v1", payload);
        return response;
      } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw error;
      }
    },
  },
  modules: {
  }
});