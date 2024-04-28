<template>

 <div id="app" class="container mt-3 " >
  
    <h3>Dados pessoais</h3>
    <hr />

    <b-form @submit="onSubmit"  >
      <b-row>
           <BarraBusca></BarraBusca>
      </b-row>

      <b-row>

        <b-col md="4" sm="12">
      
          <b-form-group label="Nome:" label-for="nome" class="font-weight-bold">
            <b-form-input
              id="nome"
              v-model="nome"
              placeholder="Ex: João Silva"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col md="5" sm="12">
          <b-form-group
            label="E-mail:"
           
            description="Seu e-mail deve ser único e não pode ter sido cadastrado."
          >
            <b-form-input
              id="email"
              @input="email"
              type="email"
              placeholder="Ex: joaosilva@email.com"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col md="4" sm="12">
          <b-form-group id="cpf" label="CPF:" label-for="cpf">
            <b-form-input
              id="cpf"
              v-model="cpf"
              placeholder="12345678909"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col md="3" sm="12">
          <b-form-group id="tel" label="TELEFONE" label-for="tel">
            <b-form-input
              id="telefone"
              v-model="telefone"
              placeholder="(69) 993073497"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <br>
      <br>
      <h3>Endereço</h3>
      <hr />

      <b-row>
        <b-col md="4" sm="12">
          <b-form-group id="cep" label="CEP:" label-for="cep">
            <b-form-input
              id="cep"
              @input="cep"
              @keyup="preencherCep"
              placeholder="76901454"
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>


      <b-row>

        <b-col md="6" sm="12">
          <b-form-group id="rua" label="RUA:" label-for="rua">
            <b-form-input
              id="rua"
              @input="rua"
              placeholder=""
              required
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col md="3" sm="12">
          <b-form-group id="numero" label="NÚMERO:" label-for="numero">
            <b-form-input
              id="numero"
              @input="numero"
              placeholder=""
              required
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col md="5" sm="12">
          <b-form-group id="bairro" label="BAIRRO:" label-for="bairro">
            <b-form-input
              id="bairro"
              @input="bairro"
              placeholder=""
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>


      <b-row>

        <b-col md="5" sm="12">
          <b-form-group id="cidade" label="CIDADE:" label-for="cidade">
            <b-form-input
              id="cidade"
              v-model="cidade"
              placeholder=""
              required
            ></b-form-input>
          </b-form-group>
        </b-col>

        <b-col md="5" sm="12">
          <b-form-group id="estado" label="ESTADO:" label-for="estado">
            <b-form-input
              id="estado"
              @input="estado"
              placeholder=""
              required
            ></b-form-input>
          </b-form-group>
        </b-col>
        
      </b-row>
    </b-form>
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
      pessoas : null,
      teste : null,
    };
  },
  methods: {
    getPessoas() {
      this.pessoas = null;
      this.teste = null;
           
      api.get(this.url).then(response => {
        this.pessoas = response.data;
       
        let dadosApi = response.data;
        let objetoTrans= Object.assign({},...dadosApi)
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

<style scoped>
@import url('https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css');

.pai-container {
  width: 100%;
  height: 100%;
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: flex-start;
}

.ae{
 background-color: blue;
}
.main-main1 {
  width: 50%;
  gap: 32px;
  width: 700px;
  padding: 50px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0);
}

.main-main2 {
  width: 50%;
  gap: 32px;
  width: 700px;
  padding: 50px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0);
}

.search-box {
  gap: 10px;
  display: flex;
  padding: 10px 16px;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
  border-color: rgba(0, 0, 0, 1);
  border-style: solid;
  border-width: 1px;
  border-radius: 8px;
  background-color: rgb(255, 245, 245);
  justify-content: space-between;

}

.search-text {

  background-color: none;
  border: 0;
  outline: 0;
  font-size: 16px;

}

.bx-search {

  color: black;

}

.label {
  color: rgb(0, 0, 0);
  font-size: 24px;
  font-style: SemiBold;
  font-family: Archivo;
  font-weight: 600;
  line-height: 30px;
  font-family: "Poppins", sans-serif;

}

.main-text02 {
  color: rgba(0, 0, 0, 1);
  font-size: 16px;
  font-style: Light;
  font-family: Roboto;
  font-weight: 300;
  line-height: 24px;
  font-family: "Poppins", sans-serif;
}

.main-row,
.main-row1,
.main-row2,
.main-row3 {
  gap: 30px;
  display: flex;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
}

.main-textfield,
.main-textfield1,
.main-textfield2,
.main-textfield3,
.main-textfield4,
.main-textfield5 {
  gap: 4px;
  flex-grow: 1;
  display: flex;
  align-items: flex-start;
  flex-shrink: 0;
  flex-direction: column;
}


.b-col{
  gap: 10px;
  display: flex;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
  color: rgb(0, 0, 0);
  font-family: "Poppins", sans-serif;

}

.b-form-input {
  gap: 10px;
  display: flex;
  padding: 10px 16px;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
  border-color: rgba(0, 0, 0, 1);
  border-style: solid;
  border-width: 1px;
  border-radius: 8px;
  background-color: rgb(224, 13, 13);
 
  outline: 0;
  font-size: 16px;
}

.main-button {
  gap: 10px;
  width: 119px;
  display: flex;
  padding: 10px 16px;
  align-self: stretch;
  align-items: flex-start;
  flex-shrink: 0;
  border-color: rgba(0, 0, 0, 1);
  border-style: solid;
  border-width: 1px;
  border-radius: 08px;
  background-color: rgba(0, 0, 0, 0.699);
}

.main-text22 {
  color: rgb(255, 255, 255);
  font-size: 16px;
  font-style: Medium;
  font-family: Roboto;
  font-weight: 500;
  line-height: 24px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>