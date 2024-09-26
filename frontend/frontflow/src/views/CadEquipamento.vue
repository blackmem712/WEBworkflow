<template>
    <div v-if="mostrarModal"
        class="fixed inset-0 z-50 flex  max-h-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="relative w-full max-h-screen max-w-4xl p-4 mx-auto bg-white rounded-lg overflow-y-auto  dark:bg-gray-700">
            <!-- Conteúdo do Modal -->
            <div class="relative bg-white rounded-lg dark:bg-gray-700">
                <!-- Cabeçalho do Modal -->
                <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                    <h3 v-if="!isEditing" class="text-lg font-semibold text-gray-900 dark:text-white">
                        Criar Novo Produto
                    </h3>
                    <h3 v-if="isEditing"  class="text-lg font-semibold text-gray-900 dark:text-white">
                      Editar Produto
                    </h3>
                    <button @click="fecharModal" type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span class="sr-only">Fechar modal</span>
                    </button>
                </div>
                <!-- Formulário -->
                <form>
                    <!---------------------- CADASTRO DO CLIENTE -------------------->
                    <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="name">Nome Completo</label>
                        <input id="name" type="text" v-model="nome"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="email">Email</label>
                        <input id="email" type="email" v-model="email"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="cpf">CPF</label>
                        <input id="cpf" type="text" v-model="cpf"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="telefone">Telefone</label>
                        <input id="telefone" type="text" v-model="telefone"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="cep">CEP</label>
                        <input id="cep" @keyup="preencherCep" type="text" v-model="cep"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="rua">Rua</label>
                        <input id="rua" type="text" v-model="rua"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="numero">Número</label>
                        <input id="numero" type="text" v-model="numero"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="bairro">Bairro</label>
                        <input id="bairro" type="text" v-model="bairro"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="cidade">Cidade</label>
                        <input id="cidade" type="text" v-model="cidade"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="estado">Estado</label>
                        <input id="estado" type="text" v-model="estado"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                </div>

                <div class="flex justify-end mt-6">
                    <button @click.prevent="$store.dispatch('clearCliente')"
                        class="px-6 py-2 text-white bg-gray-500 rounded-md hover:bg-gray-700 focus:outline-none">Limpar</button>
                </div>

                <!-- CADASTRO DO EQUIPAMENTO -->
                <div  class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 md:grid-cols-3">
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="equipamento">Equipamento</label>
                        <input id="equipamento" type="text"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="marca">Marca</label>
                        <input id="marca" type="text"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="modelo">Modelo</label>
                        <input id="modelo" type="text"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="cor">Cor</label>
                        <input id="cor" type="text"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="numeroSerie">Número em Série</label>
                        <input id="numeroSerie" type="text"
                            class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                    </div>
                </div>
                   <div class="flex justify-end mt-6">
                        <button v-if="!isEditing"  @click.prevent="criarUsuario"
                            class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-500 to-slate-200 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-cyan-800">
                            <span
                                class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Salvar
                            </span>
                        </button>
                        <button v-if="isEditing" @click.prevent="emitirAtualizacao"
                            class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-500 to-slate-200 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-cyan-800">
                            <span
                                class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Editar
                            </span>
                        </button>
                        <button v-if="isEditing" @click.prevent="Excluir" id="abrir"
                            class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-500 to-slate-200 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-cyan-800">
                            <span
                                class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                Excluir
                            </span>
                        </button>
                        <div id="abrir" tabindex="-1" class="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full">
                        <div class="relative p-4 w-full max-w-md max-h-full">
                        <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                         <button type="button" class="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                         <span class="sr-only">Close modal</span>
                         </button>
            <div class="p-4 md:p-5 text-center">
                <svg class="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Are you sure you want to delete this product?</h3>
                <button data-modal-hide="popup-modal" type="button" class="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center">
                    Yes, I'm sure
                </button>
                <button data-modal-hide="popup-modal" type="button" class="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">No, cancel</button>
            </div>
        </div>
    </div>
</div>
                    </div>
                </form>
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
        mostrarModal: {
            type: Boolean,
            required: true
        },
        isEditing:{
            type: Boolean,
            required: false

        },

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

            pessoas: null,
            teste: null,

        };
    },

    methods:{
       
    fecharModal() {
      this.$emit('close'); // Fecha o modal, emitindo um evento para o componente pai
    },
    emitirAtualizacao() {
    this.$emit('atualizarCliente');  // Emite o evento "atualizarCliente" para o componente pai
      },
      Excluir(){
        this.$emit('excluirCliente');
      },

        getPessoas() {

            this.cliente = null;
            this.pessoas = null;
            this.teste = null;


            api.get(this.url).then(response => {


                let dadosApi = response.data;
                let objetoTrans = Object.assign({}, ...dadosApi)
                this.nome = objetoTrans.nome;
                this.cpf = objetoTrans.cpf;
                this.email = objetoTrans.email;
                this.cep = objetoTrans.cep;
                this.rua = objetoTrans.rua;
                this.numero = objetoTrans.numero;
                this.bairro = objetoTrans.bairro;
                this.cidade = objetoTrans.cidade
                this.estado = objetoTrans.estado;
                this.telefone = objetoTrans.telefone;
            });

        },
        criarUsuario() {
            this.$store.dispatch("criarUsuario", this.$store.state.cliente);
       

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