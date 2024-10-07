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
      },

      equipamento: {
        equipamento: "",
        marca: "",
        modelo: "",
        cor: "",
        nunserie: "",
       
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




    CLEAR_EQUIPAMENTO(state) {
      console.log('Executando CLEAR_EQUIPAMENTO');
      state.equipamento = {
        equipamento: "",
        marca: "",
        modelo: "",
        cor: "",
        nunserie: "",
       
      };

    },
    UPDATE_EQUIPAMENTO(state, payload1) {
      state.equipamento = Object.assign(state.equipamento, payload1);
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


    clearEquipamento({ commit1 }) {
      console.log('Chamando clearEquipamento');
      commit1('CLEAR_EQUIPAMENTO');
    },
    async criarEquipamento({context1,payload1}){
      context1.commit1("UPDATE_EQUIPAMENTO",{id: payload1.id});
      try{
        const response = await api.post("/equipamentos/api/v1/",payload1);
        alert('Cliente Cadastrado com sucesso!');

        return response

      } catch(error){
        console.error("Erro ao criar equipamento", error);
        throw error;
      }

    },















  },
  modules: {
  }
});