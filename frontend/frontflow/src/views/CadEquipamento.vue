<template>
    <div class="container mx-auto bg-[#cbd5e1]">
        <div class="max-w-4xl p-6 mx-auto  rounded-md shadow-md dark:bg-gray-800 mt-20">
            <h2 class="text-lg font-[Titillium Web] text-4xl text-gray-700 capitalize dark:text-white">DADOS PESSOAIS
            </h2>
            <br>
            <BarraBusca></BarraBusca>

            <form>

                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                    <div>
                        <label class="  text-gray-700 dark:text-gray-200" for="name">Name Completo</label>
                        <input id="name" type="text" v-model="nome"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    </div>

                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="email">Email</label>
                        <input id="email" type="email" v-model="email"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="cpf">CPF</label>
                        <input id="cpf" type="text" v-model="cpf"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="cpf">Telefone</label>
                        <input id="cpf" type="text" v-model="telefone"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    </div>

                </div>

                <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-3">
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="cep">CEP</label>
                        <input id="cep" @keyup="preencherCep" type="text" v-model="cep"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="Rua">Rua</label>
                        <input id="rua" type="text" v-model="rua"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="numero">Numero</label>
                        <input id="numero" type="text" v-model="numero"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="bairro">Bairro</label>
                        <input id="bairro" type="text" v-model="bairro"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    </div>
                    <div>
                        <label class="text-gray-700 dark:text-gray-200" for="cidade">Cidade</label>
                        <input id="cidade" type="text" v-model="cidade"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    </div>
                    <div>
                        <label class="fonte-mono text-gray-700 dark:text-gray-200" for="estado">Estado</label>
                        <input id="estado" type="text" v-model="estado"
                            class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                    </div>


                </div>

            </form>
        </div>
    </div>


    <transition name="fade">

        <div ref="main2" class="container mx-auto bg-[#cbd5e1]">
            <div class="max-w-4xl p-6 mx-auto  rounded-md shadow-md dark:bg-gray-800 mt-20">
                <h2 class="text-lg font-[Titillium Web] text-4xl text-gray-700 capitalize dark:text-white">DADOS DO
                    EQUIPAMENTO</h2>
                <br>
                <BarraBusca></BarraBusca>

                <form>

                    <div class="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2">
                        <div>
                            <label class="  text-gray-700 dark:text-gray-200" for="equipamento">Equipamento</label>
                            <input id="name" type="text" v-model="equipamento"
                                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                        </div>

                        <div>
                            <label class="text-gray-700 dark:text-gray-200" for="email">Marca</label>
                            <input id="email" type="email" v-model="marca"
                                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                        </div>
                        <div>
                            <label class="text-gray-700 dark:text-gray-200" for="cpf">Modelo</label>
                            <input id="cpf" type="text" v-model="modelo"
                                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                        </div>
                        <div>
                            <label class="text-gray-700 dark:text-gray-200" for="cpf">Cor</label>
                            <input id="cpf" type="text" v-model="cor"
                                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                        </div>
                        <div>
                            <label class="text-gray-700 dark:text-gray-200" for="cpf">Número em Serie</label>
                            <input id="cpf" type="text" v-model="nunserie"
                                class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring">
                        </div>
                    </div>



                    <div class="flex justify-end mt-6">
                        <button @click="criarUsuario"
                            class="px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-[#e2e8f0] rounded-md hover:bg-[#4b5563] focus:outline-none focus:bg-gray-600 ">Salvar</button>
                    </div>

                    <button @click="$store.dispatch('clearCliente')">Limpar Cliente</button>
                </form>
            </div>
        </div>
    </transition>


</template>

<script>
import BarraBusca from '../components/BarraBusca.vue';
import { api } from '../axios-api.js';
import { mapFields } from "@/helpers.js";
import { getCep } from "../axios-api.js";



export default {
    components: {
        BarraBusca,
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
   
    methods: {

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
        clientePreenchido(novoValor) {
            if (novoValor) {
                this.$nextTick(() => {
                    this.$refs.main2.scrollIntoView({ behavior: 'smooth' });
                });
            }
        },

    },
    
    name: "cad-equip"
}
</script>


<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cutive&family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap');
</style>