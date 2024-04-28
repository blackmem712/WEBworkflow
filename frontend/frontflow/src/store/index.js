import Vue from 'vue';
import Vuex from 'vuex';
import { api } from '../axios-api.js';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    verificarcampos:false,
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
      telefone:""
    },
  },
  mutations: {
    UPDATE_CLIENTE(state, payload) {
      state.cliente = Object.assign(state.cliente, payload);
    },
   
  },
  actions: {
    criarUsuario(context, payload) {
      context.commit("UPDATE_CLIENTE", { id: payload.id });
      return api.post("/pessoas/api/v1", payload);
    },
    
  },
  modules: {
  }
})
