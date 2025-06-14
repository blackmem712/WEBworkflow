<template>
    <div v-if="mostrarModalEdic"
        class="fixed inset-0 z-50 flex max-h-screen items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div class="relative w-full max-w-4xl p-6 bg-gray-100 rounded-lg shadow-lg dark:bg-gray-800"
            style="max-width: 1000px; min-width: 800px; height: 630px; overflow-y:hidden ;">
            <!-- Conteúdo do Modal -->
            <div class="relative bg-gray-100 rounded-lg dark:bg-gray-800">
                <!-- Cabeçalho do Modal -->
                <div class="flex items-center justify-between p-4  dark:border-gray-700 mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Dados Pessoais</h3>
                    <button @click="fecharModalEdict" type="button"
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

                            <button @click="abaAtiva = 'editar'"
                                :class="{ 'text-blue-600 border-blue-600': abaAtiva === 'editar' }"
                                class="inline-block p-4 border-b-2 rounded-t-lg">Editar</button>

                        </li>
                        <li class="me-2" role="presentation">

                            <button @click="abaAtiva = 'equipamentos'"
                                :class="{ 'text-blue-600 border-blue-600': abaAtiva === 'equipamentos' }"
                                class="inline-block p-4 border-b-2 rounded-t-lg">Equipamentos</button>

                        </li>
                        <li v-if="abaAtiva === 'equipamentos'" class="me-2" role="presentation">

                            <button :class="{ 'text-blue-600 border-blue-600': abaAtiva === 'historico' }"
                                class="inline-block p-4 border-b-2 rounded-t-lg">historico</button>

                        </li>

                    </ul>
                </div>
                <!-------------------------- CONTEUDO ABAS ---------------------------->
                <div id="default-tab-content">
                    <!-------------------------------------- ABA EDITAR --------------------------------->
                    <div v-if="abaAtiva === 'editar'" class=" p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                        <form>
                            <!------------------------------------------------- DADOS DO CLIENTE ------------------------------------------------------>

                            <div class="grid grid-cols-1 gap-6 mt-6 sm:grid-cols-2 md:grid-cols-3">
                                <div>
                                    <label for="name"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome
                                        Completo</label>
                                    <input id="name" type="text" v-model="nome" :disabled="!isEditMode"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="email"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <input id="email" type="email" v-model="email" :disabled="!isEditMode"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="cpf"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF</label>
                                    <input id="cpf" type="text" v-model="cpf" :disabled="!isEditMode"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="telefone"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</label>
                                    <input id="telefone" type="text" v-model="telefone" :disabled="!isEditMode"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="cep"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">CEP</label>
                                    <input id="cep" type="text" v-model="cep" @keyup="preencherCep"
                                        :disabled="!isEditMode"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="rua"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Rua</label>
                                    <input id="rua" type="text" v-model="rua" :disabled="!isEditMode"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="numero"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Número</label>
                                    <input id="numero" type="text" v-model="numero" :disabled="!isEditMode"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="bairro"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Bairro</label>
                                    <input id="bairro" type="text" v-model="bairro" :disabled="!isEditMode"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="cidade"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Cidade</label>
                                    <input id="cidade" type="text" v-model="cidade" :disabled="!isEditMode"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                                <div>
                                    <label for="estado"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300">Estado</label>
                                    <input id="estado" type="text" v-model="estado" :disabled="!isEditMode"
                                        class="mt-1 block w-full py-2.5 px-4 text-sm bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                </div>
                            </div>
                            <div class="flex justify-end mt-6 space-x-2">

                                <button @click.prevent="toggleEditMode" v-if="!isEditMode"
                                    class="py-2.5 px-6  text-sm text-white bg-green-500 hover:bg-green-800 rounded-lg focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Editar
                                </button>
                                <button @click.prevent="emitirAtualizacao" v-if="isEditMode"
                                    class="py-2.5 px-6  text-sm text-white bg-blue-500 hover:bg-blue-800 rounded-lg focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Salvar
                                </button>
                                <button @click.prevent="Excluir" id="abrir"
                                    class="py-2.5 px-6 text-sm text-white bg-red-500 hover:bg-red-800 rounded-lg focus:ring-4 focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                    Excluir
                                </button>
                            </div>
                        </form>

                    </div>

                    <!----------------------------------------------- ABA LISTA DE EQUIPAMENTOS -------------------------------->
                    <div v-if="abaAtiva === 'equipamentos'" class=" p-4 rounded-lg bg-gray-50 dark:bg-gray-800">

                        <!------------------------------------------------- LISTA DE EQUIPAMENTOS ------------------------------------------------------>
                        <table class="table-auto w-full">
                            <thead>
                                <tr class="text-xs text-gray-500 text-left">
                                    <th class="pb-3 font-medium">Equipamento</th>
                                    <th class="pb-3 font-medium">Marca</th>
                                    <th class="pb-3 font-medium"> cor</th>
                                    <th class="pb-3 font-medium">numero de série</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="equipamento in equipamentos" :key="equipamento.id"
                                    class="text-xs bg-gray-50 hover:bg-[#e2e8f0]">

                                    <td class="flex px-4 py-3">
                                        <div>
                                            <p class="font-medium">
                                                {{ equipamento.equipamento }}</p>
                                        </div>
                                    </td>
                                    <td class="font-medium">
                                        {{ equipamento.marca }}</td>

                                    <td class="font-medium">
                                        {{ equipamento.cor }}
                                    </td>
                                    <td class="font-medium">
                                        {{ equipamento.nun_serie }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-if="abaAtiva === 'historico'" class=" p-4 rounded-lg bg-gray-50 dark:bg-gray-800">

                        <!------------------------------------------------- LISTA DE EQUIPAMENTOS ------------------------------------------------------>
                        <table class="table-auto w-full">
                            <thead>
                                <tr class="text-xs text-gray-500 text-left">
                                    <th class="pb-3 font-medium">Equipamento</th>
                                    <th class="pb-3 font-medium">Marca</th>
                                    <th class="pb-3 font-medium"> cor</th>
                                    <th class="pb-3 font-medium">numero de série</th>

                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="equipamento in equipamentos" :key="equipamento.id"
                                    class="text-xs bg-gray-50 hover:bg-[#e2e8f0]">

                                    <td class="flex px-4 py-3">
                                        <div>
                                            <p class="font-medium">
                                                {{ equipamento.equipamento }}</p>
                                        </div>
                                    </td>
                                    <td class="font-medium">
                                        {{ equipamento.marca }}</td>

                                    <td class="font-medium">
                                        {{ equipamento.cor }}
                                    </td>
                                    <td class="font-medium">
                                        {{ equipamento.nun_serie }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>


            </div>
        </div>
    </div>


</template>
<script>

import { api } from '../axios-api.js';
import { mapFields } from "@/helpers.js";

export default {
    name: "cad-edic",
    props: {
        mostrarModalEdic: {// mostrar o modal 
            type: Boolean,
            required: true
        },
        clienteId: {  // Receber o clienteId como prop
            type: Number,
            required: true
        }

    },
    data() {
        return {
            abaAtiva: 'editar',
            equipamentos: [],
            isEditMode: false,







        }

    },
    computed: {
        ...mapFields({
            fields: [
                "id",
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


    methods: {

        buscarEquipamentos(clienteId) {
            api.get(`/equipamentos/api/v1/?cliente=${clienteId}`).then(response => {
                this.equipamentos = response.data; // Equipamentos do cliente
            }).catch(error => {
                console.error("Erro ao buscar equipamentos do cliente:", error);
            });



        },

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
            this.isEditMode = false;
            this.abaAtiva = "editar";
        },
        emitirAtualizacao() {
            this.$emit('atualizarCliente');
            this.isEditMode = false;// Emite o evento "atualizarCliente" para o componente pai
        },
        Excluir() {
            this.$emit('excluirCliente');
        },

        toggleEditMode() {
            this.isEditMode = true;  // Habilita o modo de edição
        },




    },
    watch: {
        mostrarModalEdic(newVal) {
            if (newVal) {
                this.isEditMode = false;
                this.buscarEquipamentos(this.clienteId);
            }
        }
    }
}

</script>