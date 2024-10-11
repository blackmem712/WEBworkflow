import { createStore } from 'vuex'; // Importar createStore do Vuex
import { api } from '../axios-api.js';

export default createStore({
  state() {
    return {

      verificarcampos: false,

      cliente: {
        id: null,
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
        cliente:null,
        historico_id:null,
      }


    };


  },

  mutations: {
    CLEAR_CLIENTE(state) {
      console.log('Executando CLEAR_CLIENTE');
      state.cliente = {
        id: null,
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
        nun_serie: "",
      
       
      };

    },
    UPDATE_EQUIPAMENTO(state, payload) {
      state.equipamento = Object.assign(state.equipamento, payload);
    },
    SET_CLIENTE_ID_EQUIPAMENTO(state, cliente) {
      // Atualiza o state do equipamento com o ID do cliente
      state.equipamento.cliente = cliente;
    }

  },
  actions: {
    

    clearCliente({ commit }) {
      console.log('Chamando clearCliente');
      commit('CLEAR_CLIENTE');
    },
    async criarUsuario({commit}, payload) {
      commit("UPDATE_CLIENTE", { id: payload.id });
      try {
        const response = await api.post("/pessoas/api/v1/", payload);
        alert('Cliente Cadastrado com sucesso!');

        return response;

      } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw error;
      }
    },


    clearEquipamento({ commit }) {
      console.log('Chamando clearEquipamento');
      commit('CLEAR_EQUIPAMENTO');
    },
    async criarEquipamento({ state}){
      
      const equipamentoPayload  = {
        cliente: state.equipamento.cliente,
        equipamento: state.equipamento.equipamento,
        marca: state.equipamento.marca,
        modelo: state.equipamento.modelo,
        cor: state.equipamento.cor,
        nun_serie: state.equipamento.nun_serie,
        historico_id:null
      };
      try{
        const response = await api.post("/equipamentos/api/v1/",equipamentoPayload );
        alert('Equipamento Cadastrado com sucesso!');

        return response

      } catch(error){
        console.error("Erro ao criar equipamento", error);
        throw error;
      }

    },
    setClienteIdEquipamento({ commit }, clienteId) {
      commit('SET_CLIENTE_ID_EQUIPAMENTO', clienteId);
    },















  },
  modules: {
  }
});