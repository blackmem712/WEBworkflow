import { createStore } from 'vuex'; // Importar createStore do Vuex
import { api } from '../axios-api.js';

export default createStore({
  state() {
    return {

      verificarcampos: false,
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
    CLEAR_CLIENTE(state) {
      console.log('Executando CLEAR_CLIENTE');
      state.cliente = {
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
      };

    },
    UPDATE_CLIENTE(state, payload) {
      state.cliente = Object.assign(state.cliente, payload);
    },

  },
  actions: {
    
    clearCliente({ commit }) {
      console.log('Chamando clearCliente');
      commit('CLEAR_CLIENTE');
    },
    async criarUsuario(context, payload) {
      context.commit("UPDATE_CLIENTE", { id: payload.id });
      try {
        const response = await api.post("/pessoas/api/v1/", payload);
        alert('Cliente Cadastrado com sucesso!');

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