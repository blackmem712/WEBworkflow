<template>
    <div v-if="mostrarModalEdic"
        class="fixed inset-0 z-50 flex  max-h-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div
            class="relative w-full max-h-screen max-w-4xl p-4 mx-auto bg-white rounded-lg overflow-y-auto  dark:bg-gray-700">
            <!-- Conteúdo do Modal -->
            <div class="relative bg-white rounded-lg dark:bg-gray-700">
                <!-- Cabeçalho do Modal -->
                <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600 mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                        Dados Pessoais
                    </h3>
                    <button @click="fecharModalEdict" type="button"
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
                    <!---------------------- DADOS DO CLIENTE -------------------->

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
                            <label class="text-gray-700 dark:text-gray-200 " for="estado">Estado</label>
                            <input id="estado" type="text" v-model="estado"
                                class="block w-full p-4 pl-9 text-sm text-gray-900 dark:text-gray-200 border border-slate-300 rounded-lg focus:ring-slate-400 focus:border-slate-400">
                        </div>
                    </div>
                    <div class="flex justify-end mt-6">
                       
                       <button  @click.prevent="emitirAtualizacao"
                           class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-500 to-slate-200 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-cyan-800">
                           <span
                               class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                               Editar
                           </span>
                       </button>
                       <button @click.prevent="Excluir" id="abrir"
                           class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-500 to-slate-200 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-cyan-800">
                           <span
                               class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                               Excluir
                           </span>
                       </button>
                       </div>

                    <div class="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                            Equipamentos
                        </h3>
                    </div>
                    <!---------------------- TABELA DO EQUIPAMENTO DO MODAL DE EDITAR -------------------->
                    <table class="table-auto w-full">
                        <thead>
                            <tr class="text-xs text-gray-500 text-left">

                                <th class="pb-3 font-medium">Equipamento</th>
                                <th class="pb-3 font-medium">Marca</th>
                                <th class="pb-3 font-medium">Status</th>
                                <th class="pb-3 font-medium">Email</th>
                                <th class="pb-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="cliente in clientes" :key="cliente.id"
                                class="text-xs bg-gray-50 hover:bg-[#e2e8f0]">

                                <td class="flex px-4 py-3">
                                    <img class="w-8 h-8 mr-4 object-cover rounded-md"
                                        src="https://images.unsplash.com/photo-1559893088-c0787ebfc084?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"
                                        alt="">
                                    <div>
                                        <p class="font-medium">{{ cliente.nome }}</p>
                                    </div>
                                </td>
                                <td class="font-medium">{{ cliente.telefone }}</td>
                                <td>
                                    <span
                                        class="inline-block py-1 px-2 text-white bg-green-500 rounded-full">Paid</span>
                                </td>
                                <td>
                                    <span class="inline-block py-1 px-2 text-purple-500 bg-purple-50 rounded-full">{{
                                        cliente.email }}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                   
                </form>
            </div>
        </div>
    </div>


</template>
<script>

import { mapFields } from "@/helpers.js";
export default {
    name: "cad-edic",
    props: {
        mostrarModalEdic: {// mostrar o modal 
            type: Boolean,
            required: true
        },
    },
    computed:{
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

    },

    data() {
        return {
           




        }

    },
    methods: {
        fecharModalEdict() {
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
        },
        emitirAtualizacao() {
            this.$emit('atualizarCliente');  // Emite o evento "atualizarCliente" para o componente pai
        },
        Excluir() {
            this.$emit('excluirCliente');
        },
        
        

    }
}

</script>