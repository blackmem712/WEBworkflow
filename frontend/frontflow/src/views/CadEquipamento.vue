<template>
    <div v-if="mostrarModal"
        class="fixed inset-0 z-50 flex max-h-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="relative w-full max-w-4xl p-6 bg-gray-100 rounded-lg shadow-lg dark:bg-gray-800"
            style="max-width: 1000px; min-width: 800px; height: 630px; overflow-y:hidden ;">

            <!-- Conteúdo do Modal -->
            <div class="relative bg-gray-100 rounded-lg dark:bg-gray-800">
                <!-- Cabeçalho do Modal -->
                <div class="flex items-center justify-between p-4 border-b dark:border-gray-700 mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Criar Novo Equipamento</h3>
                    <button @click="fecharModal" type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Fechar modal</span>
                    </button>
                </div>

                <!-------------------------- ABAS ---------------------------->
                <div class="mb-4 border-b border-gray-200 dark:border-gray-700">

                    <ul class="flex flex-wrap -mb-px text-sm font-medium text-center" id="default-tab"
                        data-tabs-toggle="#default-tab-content" role="tablist">
                        <li class="me-2" role="presentation">

                            <button @click="abaAtiva = 'cadastrarEquip'"
                                :class="{ 'text-blue-600 border-blue-600': abaAtiva === 'cadastrarEquip' }"
                                class="inline-block p-4 border-b-2 rounded-t-lg">Editar</button>

                        </li>
                        <li class="me-2" role="presentation">

                            <button @click="abaAtiva = 'cadastrarCliente'"
                                :class="{ 'text-blue-600 border-blue-600': abaAtiva === 'cadastrarCliente' }"
                                class="inline-block p-4 border-b-2 rounded-t-lg">Equipamentos</button>

                        </li>

                    </ul>
                </div>
                <div id="default-tab-content">
                    <!-------------------------------------- ABA CADASTRAR EQUIPAMENTO --------------------------------->
                    <div v-if="abaAtiva === 'cadastrarEquip'" class=" p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <form>
                            <!-- Pesquisa de Cliente -->
                            <div class="flex items-center space-x-4">
                                <div class="relative w-full">
                                    <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <svg class="w-5 h-5 text-slate-400" aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                                stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                        </svg>
                                    </div>
                                    <input v-model="busca" @input="buscarClientes" type="search" id="default-search"
                                        class="block w-full py-2.5 px-4 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                        placeholder="Buscar Clientes..." required />
                                </div>
                                <button @click="abrirCadastro" type="button"
                                    class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-500 to-slate-200 group-hover:from-slate-400 group-hover:slate-300 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-blue-800">
                                    <span
                                        class="relative px-7 py-0,5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                        Novo Cliente
                                    </span>
                                </button>
                            </div>

                            <!-- Lista de Clientes Filtrados -->
                            <ul v-if="clientesFiltrados.length"
                                class="mt-2 bg-white border border-gray-300 rounded-lg shadow-lg w-full z-10">
                                <li v-for="cliente in clientesFiltrados" :key="cliente.id"
                                    @click="selecionarCliente(cliente)"
                                    class="cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700">
                                    {{ cliente.nome }}
                                </li>
                            </ul>
                            <div v-if="equipamentos.length > 0" class="mt-6">
                                <label for="equipamento-select"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300">Selecione um
                                    Equipamento:</label>
                                <select id="equipamento-select" v-model="equipamentoSelecionado"
                                    class="block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option v-for="equipamento in equipamentos" :key="equipamento.id"
                                        :value="equipamento.id">
                                        {{ equipamento.equipamento }} - {{ equipamento.marca }}
                                    </option>
                                </select>
                            </div>

                            <!-- Cadastro de Equipamento -->
                            <div class="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3">
                                <div>
                                    <label for="equipamento"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Equipamento</label>
                                    <input id="equipamento" type="text" v-model="equipamento"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="marca"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Marca</label>
                                    <input id="marca" type="text" v-model="marca"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="modelo"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Modelo</label>
                                    <input id="modelo" type="text" v-model="modelo"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="cor"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cor</label>
                                    <input id="cor" type="text" v-model="cor"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="numeroSerie"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Número em
                                        Série</label>
                                    <input id="numeroSerie" type="text" v-model="nun_serie"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                            </div>

                            <!-- Botão para salvar equipamento -->
                            <div class="flex justify-end mt-6">
                                <button @click.prevent="criarEquipamento"
                                    class="py-2.5 px-6 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Salvar
                                </button>
                            </div>
                        </form>

                    </div>
                    <!-------------------------------------- ABA CADASTRAR CLIENTE --------------------------------->
                    <div v-if="abaAtiva === 'cadastrarCliente'" class=" p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <form>
                            <div class="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3">
                                <div>
                                    <label for="name"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome
                                        Completo</label>
                                    <input id="name" type="text" v-model="nome"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="email"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <input id="email" type="email" v-model="email"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="cpf"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF</label>
                                    <input id="cpf" type="text" v-model="cpf"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="telefone"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                                    <input id="telefone" type="text" v-model="telefone"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="cep"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">CEP</label>
                                    <input id="cep" type="text" v-model="cep" @keyup="preencherCep"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="rua"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rua</label>
                                    <input id="rua" type="text" v-model="rua"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="numero"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Número</label>
                                    <input id="numero" type="text" v-model="numero"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="bairro"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bairro</label>
                                    <input id="bairro" type="text" v-model="bairro"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="cidade"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cidade</label>
                                    <input id="cidade" type="text" v-model="cidade"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="estado"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                                    <input id="estado" type="text" v-model="estado"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                            </div>
                            <div  class="flex justify-end mt-6">
                                <button @click.prevent="criarUsuario"
                                    class="py-2.5 px-6 text-sm text-white bg-green-500 hover:bg-green-600 rounded-lg focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>

import { api } from '../axios-api.js';
import { mapFields } from "@/helpers.js";
import { getCep } from "../axios-api.js";



export default {
    name: "cad-equip",
    props: {
        mostrarModal: {// mostrar o modal 
            type: Boolean,
            required: true
        },

        clientes: {  // buscando lista de clientes que está em concliente.vue
            type: Array,
            required: true
        }

    },
    computed: {
        ...mapFields({
            fields: [
                "nome",
                "cpf",
                "email",
                "cep",
                "rua",
                "numero",
                "bairro",
                "cidade",
                "estado",
                "telefone"
            ],
            base: "cliente",
            mutation: "UPDATE_CLIENTE",
        }),
        ...mapFields({
            fields: [
                "equipamento",
                "marca",
                "modelo",
                "cor",
                "nun_serie",
            ],
            base: "equipamento",
            mutation: "UPDATE_EQUIPAMENTO",
        }),

        clientePreenchido() {
            const cliente = this.$store.state.cliente;
            return Object.values(cliente).every(val => val !== "");
        },


        url() {
            let queryString = "";
            for (let key in this.$route.query) {
                queryString += `${key}=${this.$route.query[key]}`

            }

            return "/pessoas/api/v1/?" + queryString;
        },

    },

    created() {


    },
    data() {
        return {

            abaAtiva: "cadastrarEquip",
            pessoas: null,
            teste: null,
            busca: "",               // Campo de busca
            clientesFiltrados: [],// Lista de clientes filtrados
            iscad: false,
            equipamentos: [],         // Equipamentos do cliente selecionado
            equipamentoSelecionado: null, // Equipamento selecionado no select
            equipamentoDetalhes: {},      // Detalhes do equipamento selecionado

        };
    },

    methods: {

        fecharModal() {
            this.$emit('close');
            this.nome = "";
            this.cpf = "";
            this.email = "";
            this.cep = "";
            this.rua = "";
            this.numero = "";
            this.bairro = "";
            this.cidade = "";
            this.estado = "";
            this.telefone = "";
            this.busca = "";
            this.clientesFiltrados = [];
            this.iscad = false;
            this.$store.dispatch('clearEquipamento');
            this.equipamentoSelecionado = "";
            this.abaAtiva= "cadastrarEquip";

        },
        emitirAtualizacao() {
            this.$emit('atualizarCliente');  // Emite o evento "atualizarCliente" para o componente pai
        },
        Excluir() {
            this.$emit('excluirCliente');
        },


        criarUsuario() {
            this.$store.dispatch("criarUsuario", this.$store.state.cliente);
            this.fecharModal();


        },
        buscarClientes() {
            if (this.busca.length >= 2) { // Busca a partir de 2 caracteres
                this.clientesFiltrados = this.clientes.filter(cliente =>
                    cliente.nome.toLowerCase().includes(this.busca.toLowerCase())
                );
            } else {
                this.clientesFiltrados = []; // Limpa as sugestões se a busca for muito curta
            }
        },
        selecionarCliente(cliente) {
            // Preencher os campos do formulário com os dados do cliente selecionado
            this.nome = cliente.nome;
            this.cpf = cliente.cpf;
            this.email = cliente.email;
            this.cep = cliente.cep;
            this.rua = cliente.rua;
            this.numero = cliente.numero;
            this.bairro = cliente.bairro;
            this.cidade = cliente.cidade;
            this.estado = cliente.estado;
            this.telefone = cliente.telefone;


            this.busca = cliente.nome;  // Atualiza o campo de busca
            this.clientesFiltrados = [];// Limpa a lista de sugestões
            this.$store.dispatch('setClienteIdEquipamento', cliente.id);
            this.buscarEquipamentos(cliente.id);
        },
        buscarEquipamentos(clienteId) {
            api.get(`/equipamentos/api/v1/?cliente=${clienteId}`).then(response => {
                this.equipamentos = response.data; // Equipamentos do cliente
            }).catch(error => {
                console.error("Erro ao buscar equipamentos do cliente:", error);
            });




        },

        criarEquipamento() {
            this.$store.dispatch('criarEquipamento');  // Dispara a action para criar o equipamento
            this.fecharModal();
            this.$store.dispatch('clearEquipamento');
            this.equipamentoSelecionado = "";


        },


        preencherCep() {
            const cep = this.cep.replace(/\D/g, "");
            if (cep.length === 8) {
                getCep(cep).then(response => {
                    this.rua = response.data.logradouro;
                    this.bairro = response.data.bairro;
                    this.estado = response.data.uf;
                    this.cidade = response.data.localidade;
                });
            }
        },




    },
    watch: {
        url() {
            this.getPessoas()

        },
        busca(newVal) {
            // Limpar os campos se o campo de busca for esvaziado
            if (newVal === "") {
                this.nome = "";
                this.cpf = "";
                this.email = "";
                this.cep = "";
                this.rua = "";
                this.numero = "";
                this.bairro = "";
                this.cidade = "";
                this.estado = "";
                this.telefone = "";
            }
        },
        equipamentoSelecionado(newId) {
            // Preencher os campos com os dados do equipamento selecionado
            const equipamento = this.equipamentos.find(equip => equip.id === newId);
            if (equipamento) {
                this.equipamento = equipamento.equipamento;
                this.marca = equipamento.marca;
                this.modelo = equipamento.modelo;
                this.cor = equipamento.cor;
                this.nun_serie = equipamento.nun_serie;
            }
        },
        fecharModal() {

        }

    },


}
</script>


<style>
@import url('https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet');
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cutive&family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap');
</style>