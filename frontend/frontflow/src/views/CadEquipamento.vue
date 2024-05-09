<template>
  <div :class="{'md:max-lg:flex bg-midnight': true, 'sidebar-open': isSidebarOpen}">
      <div class="main-main2">


          <span class="main-text">CADASTRO DE EQUIPAMENTOS</span>

          <span class="main-text02">Insira os dados do cliente</span>
          <BarraBusca></BarraBusca>

          <div class="main-row">
              <div class="main-textfield">
                  <div class="main-label">
                      <label class="main-text3">Nome Completo</label>
                  </div>
                  <input type="text" id="nome" name="nome" v-model="nome" class="main-container1" />
              </div>
          </div>

          <div class="main-row1">


              <div class="main-textfield">
                  <div class="main-label1">
                      <label class="main-text03">CPF</label>
                  </div>
                  <input type="text" id="cpf" name="cpf" v-model="cpf" class="main-container2" />
              </div>

              <div class="main-textfield1">
                  <div class="main-label2">
                      <label class="main-text03">Email</label>
                  </div>
                  <input type="text" id="email" name="email" v-model="email" class="main-container3" />
              </div>

          </div>



          <div class="main-row2">


              <div class="main-textfield">
                  <div class="main-label1">
                      <label class="main-text03">CEP</label>
                  </div>
                  <input type="text" id="cep" name="CEP" v-model="cep" @keyup="preencherCep"
                      class="main-container2" />
              </div>

              <div class="main-textfield1">
                  <div class="main-label2">
                      <label class="main-text03">RUA</label>
                  </div>
                  <input type="text" id="rua" name="rua" v-model="rua" class="main-container3" />
              </div>



          </div>

          <div class="main-row3">

              <div class="main-textfield">
                  <div class="main-label1">
                      <label class="main-text03">NUMERO</label>
                  </div>
                  <input type="text" id="numero" name="numero" v-model="numero" class="main-container2" />
              </div>

              <div class="main-textfield1">
                  <div class="main-label2">
                      <label class="main-text03">BAIRRO</label>
                  </div>
                  <input type="text" id="bairro" name="bairro" v-model="bairro" class="main-container3" />
              </div>
          </div>

          <div class="main-row3">

              <div class="main-textfield">
                  <div class="main-label1">
                      <label class="main-text03">CIDADE</label>
                  </div>
                  <input type="text" id="cidade" name="cidade" v-model="cidade" class="main-container2" />
              </div>

              <div class="main-textfield1">
                  <div class="main-label2">
                      <label class="main-text03">ESTADO</label>
                  </div>
                  <input type="text" id="estado" name="estado" v-model="estado" class="main-container3" />
              </div>
          </div>
          <div class="main-row3">

              <div class="textfield">
                  <div class="main-label1">
                      <label class="main-text03">TELEFONE</label>
                  </div>
                  <input type="text" id="telefone" name="telefone" v-model="telefone" class="main-container2" />
              </div>
          </div>

      </div>



      <transition name="fade">
          <div class="main-main2" v-if="clientePreenchido" ref="mainMain2">

              <span class="main-text02">Insira os dados do Equipamento</span>
              <div class="search-box">
                  <input type="text" class="search-text" placeholder="Pesquisar equipamento...">
                  <a class="bx bx-search"></a>
              </div>




              <div class="main-row1">


                  <div class="main-textfield">
                      <div class="main-label1">
                          <label class="main-text03">EQUIPAMENTO</label>
                      </div>
                      <input type="text" id="equipamento" name="equipamento" class="main-container2" />
                  </div>

                  <div class="main-textfield1">
                      <div class="main-label2">
                          <label class="main-text03">MARCA</label>
                      </div>
                      <input type="text" id="marca" name="marca" class="main-container3" />
                  </div>

              </div>



              <div class="main-row2">


                  <div class="main-textfield">
                      <div class="main-label1">
                          <label class="main-text03">MODELO</label>
                      </div>
                      <input type="text" id="modelo" name="modelo" class="main-container2" />
                  </div>

                  <div class="main-textfield1">
                      <div class="main-label2">
                          <label class="main-text03">COR</label>
                      </div>
                      <input type="text" id="cor" name="cor" class="main-container3" />
                  </div>



              </div>


              <div class="main-row3">

                  <div class="main-textfield1">
                      <div class="main-label2">
                          <label class="main-text03">NUMERO DE SÉRIE</label>
                      </div>
                      <input type="text" id="numserie" name="nunserie" class="main-container4" />
                  </div>
              </div>
              <button type="button" class="main-button" @click="criarUsuario">
                  <a class="main-text22">Salvar</a>
              </button>
          </div>
      </transition>
  </div>


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
          let queryString = ""
          for (let key in this.$route.query) {
              queryString += `${key}=${this.$route.query[key]}`

          }

          return "/pessoas/api/v1/?" + queryString;
      },
      
  },
  data() {
      return {
          pessoas: null,
          teste: null,
      };
  },
  methods: {
      getPessoas() {
          this.pessoas = null;
          this.teste = null;

          api.get(this.url).then(response => {
              this.pessoas = response.data;

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
          this.getPessoas();
      },
      clientePreenchido(novoValor) {
          if (novoValor) {
              this.$nextTick(() => {
                  this.$refs.mainMain2.scrollIntoView({ behavior: 'smooth' });
              });
          }
      },

  },
  created() {
      this.getPessoas();
  },
  name: "cad-equip"
}
</script>

<style >
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
</style>