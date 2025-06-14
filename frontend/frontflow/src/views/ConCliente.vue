<template>
  <div class="relative dark:bg-gray-800 sm:rounded-lg mb-6">
    <div class="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
      <div class="w-full md:w-1/2">
        <!-- Formulário de Pesquisa -->
        <div class="flex items-center space-x-4">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg class="w-5 h-5 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input v-model="busca" @input="buscarClientes" type="search" id="default-search"
              class="block w-full py-2.5 px-4 pl-10 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-slate-500 focus:border-slate-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Buscar Clientes..." required />
          </div>
        </div>

        <!-- Lista de Clientes Filtrados -->
      
      </div>

      <!-- Div para alinhar os botões à direita -->
      <div class="flex items-center ml-auto space-x-2">

        <button @click="abrirModal" data-modal-target="crud-modal" data-modal-toggle="crud-modal" type="button"
          class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-500 to-slate-200 group-hover:from-slate-400 group-hover:slate-300 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-blue-800">
          <span
            class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Cadastrar
          </span>
        </button>

        <CadEquipamento :mostrarModal="mostrarModal" :isEditing="isEditing" @close="fecharModal" :clientes="clientes">
        </CadEquipamento>

        
        <button
          class="relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-slate-500 to-slate-200 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-slate-300 dark:focus:ring-cyan-800">
          <span
            class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
            Editar
          </span>
        </button>
      </div>
    </div>
  </div>

  <div class="container px-1 mx-auto">
    <div class="p-4 mb-6 bg-white  overflow-x-auto">
      <table class="table-auto w-full">
        <thead>
          <tr class="text-xs text-gray-500 text-left">
            <th class="pb-3 font-medium">Nome</th>
            <th class="pb-3 font-medium">Telefone</th>
            <th class="pb-3 font-medium">Email</th>
            <th class="pb-3 font-medium">Opções</th>
      
          </tr>
        </thead>
        <tbody v-if="clientesFiltrados.length">
          <tr  v-for="cliente in clientesFiltrados" :key="cliente.id" @click="abrirModalEditar(cliente.id)"
            class="text-xs bg-gray-50 hover:bg-[#e2e8f0]">

            <td class="flex px-4 py-3">
              <div>
                <p class="font-medium">
                  {{ cliente.nome }}</p>
              </div>
            </td>
            <td class="font-medium">
              {{ cliente.telefone }}</td>

            <td class="font-medium">>
             {{ cliente.email }}
            </td>
            <td>
              <a @click="abrirModalEditar(cliente.id)" class="inline-block mr-2">
                <svg width="18" height="18" viewbox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.4999 9C16.2789 9 16.0669 9.0878 15.9106 9.24408C15.7544 9.40036 15.6666 9.61232 15.6666 9.83333V14.8333C15.6666 15.0543 15.5788 15.2663 15.4225 15.4226C15.2662 15.5789 15.0542 15.6667 14.8332 15.6667H3.16656C2.94555 15.6667 2.73359 15.5789 2.57731 15.4226C2.42103 15.2663 2.33323 15.0543 2.33323 14.8333V3.16667C2.33323 2.94565 2.42103 2.73369 2.57731 2.57741C2.73359 2.42113 2.94555 2.33333 3.16656 2.33333H8.16657C8.38758 2.33333 8.59954 2.24554 8.75582 2.08926C8.9121 1.93298 8.9999 1.72101 8.9999 1.5C8.9999 1.27899 8.9121 1.06702 8.75582 0.910744C8.59954 0.754464 8.38758 0.666667 8.16657 0.666667H3.16656C2.50352 0.666667 1.86764 0.930059 1.3988 1.3989C0.929957 1.86774 0.666565 2.50363 0.666565 3.16667V14.8333C0.666565 15.4964 0.929957 16.1323 1.3988 16.6011C1.86764 17.0699 2.50352 17.3333 3.16656 17.3333H14.8332C15.4963 17.3333 16.1322 17.0699 16.601 16.6011C17.0698 16.1323 17.3332 15.4964 17.3332 14.8333V9.83333C17.3332 9.61232 17.2454 9.40036 17.0892 9.24408C16.9329 9.0878 16.7209 9 16.4999 9ZM3.9999 9.63333V13.1667C3.9999 13.3877 4.0877 13.5996 4.24398 13.7559C4.40026 13.9122 4.61222 14 4.83323 14H8.36657C8.47624 14.0006 8.58496 13.9796 8.68649 13.9381C8.78802 13.8967 8.88037 13.8356 8.95823 13.7583L14.7249 7.98333L17.0916 5.66667C17.1697 5.5892 17.2317 5.49703 17.274 5.39548C17.3163 5.29393 17.3381 5.18501 17.3381 5.075C17.3381 4.96499 17.3163 4.85607 17.274 4.75452C17.2317 4.65297 17.1697 4.5608 17.0916 4.48333L13.5582 0.908333C13.4808 0.830226 13.3886 0.768231 13.287 0.725924C13.1855 0.683617 13.0766 0.661835 12.9666 0.661835C12.8566 0.661835 12.7476 0.683617 12.6461 0.725924C12.5445 0.768231 12.4524 0.830226 12.3749 0.908333L10.0249 3.26667L4.24156 9.04167C4.16433 9.11953 4.10323 9.21188 4.06176 9.31341C4.02029 9.41494 3.99926 9.52366 3.9999 9.63333ZM12.9666 2.675L15.3249 5.03333L14.1416 6.21667L11.7832 3.85833L12.9666 2.675ZM5.66656 9.975L10.6082 5.03333L12.9666 7.39167L8.0249 12.3333H5.66656V9.975Z"
                    fill="#382CDD"></path>
                </svg>
              </a>
              <a class="inline-block">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.33333 15C8.55435 15 8.76631 14.9122 8.92259 14.7559C9.07887 14.5996 9.16667 14.3877 9.16667 14.1667V9.16666C9.16667 8.94564 9.07887 8.73368 8.92259 8.5774C8.76631 8.42112 8.55435 8.33332 8.33333 8.33332C8.11232 8.33332 7.90036 8.42112 7.74408 8.5774C7.5878 8.73368 7.5 8.94564 7.5 9.16666V14.1667C7.5 14.3877 7.5878 14.5996 7.74408 14.7559C7.90036 14.9122 8.11232 15 8.33333 15ZM16.6667 4.99999H13.3333V4.16666C13.3333 3.50362 13.0699 2.86773 12.6011 2.39889C12.1323 1.93005 11.4964 1.66666 10.8333 1.66666H9.16667C8.50363 1.66666 7.86774 1.93005 7.3989 2.39889C6.93006 2.86773 6.66667 3.50362 6.66667 4.16666V4.99999H3.33333C3.11232 4.99999 2.90036 5.08779 2.74408 5.24407C2.5878 5.40035 2.5 5.61231 2.5 5.83332C2.5 6.05434 2.5878 6.2663 2.74408 6.42258C2.90036 6.57886 3.11232 6.66666 3.33333 6.66666H4.16667V15.8333C4.16667 16.4964 4.43006 17.1322 4.8989 17.6011C5.36774 18.0699 6.00363 18.3333 6.66667 18.3333H13.3333C13.9964 18.3333 14.6323 18.0699 15.1011 17.6011C15.5699 17.1322 15.8333 16.4964 15.8333 15.8333V6.66666H16.6667C16.8877 6.66666 17.0996 6.57886 17.2559 6.42258C17.4122 6.2663 17.5 6.05434 17.5 5.83332C17.5 5.61231 17.4122 5.40035 17.2559 5.24407C17.0996 5.08779 16.8877 4.99999 16.6667 4.99999ZM8.33333 4.16666C8.33333 3.94564 8.42113 3.73368 8.57741 3.5774C8.73369 3.42112 8.94565 3.33332 9.16667 3.33332H10.8333C11.0543 3.33332 11.2663 3.42112 11.4226 3.5774C11.5789 3.73368 11.6667 3.94564 11.6667 4.16666V4.99999H8.33333V4.16666ZM14.1667 15.8333C14.1667 16.0543 14.0789 16.2663 13.9226 16.4226C13.7663 16.5789 13.5543 16.6667 13.3333 16.6667H6.66667C6.44565 16.6667 6.23369 16.5789 6.07741 16.4226C5.92113 16.2663 5.83333 16.0543 5.83333 15.8333V6.66666H14.1667V15.8333ZM11.6667 15C11.8877 15 12.0996 14.9122 12.2559 14.7559C12.4122 14.5996 12.5 14.3877 12.5 14.1667V9.16666C12.5 8.94564 12.4122 8.73368 12.2559 8.5774C12.0996 8.42112 11.8877 8.33332 11.6667 8.33332C11.4457 8.33332 11.2337 8.42112 11.0774 8.5774C10.9211 8.73368 10.8333 8.94564 10.8333 9.16666V14.1667C10.8333 14.3877 10.9211 14.5996 11.0774 14.7559C11.2337 14.9122 11.4457 15 11.6667 15Z"
                    fill="#E85444"></path>
                </svg>
              </a>
            </td>
          </tr>

        </tbody>
        <tbody v-if="!clientesFiltrados.length">
          <tr  v-for="cliente in clientes" :key="cliente.id" @click="abrirModalEditar(cliente.id)"
            class="text-xs bg-gray-50 hover:bg-[#e2e8f0]">

            <td class="flex px-4 py-3">
              <div>
                <p class="font-medium">
                  {{ cliente.nome }}</p>
              </div>
            </td>
            <td class="font-medium">
              {{ cliente.telefone }}</td>

            <td class="font-medium">>
             {{ cliente.email }}
            </td>
            <td>
              <a @click="abrirModalEditar(cliente.id)" class="inline-block mr-2">
                <svg width="18" height="18" viewbox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M16.4999 9C16.2789 9 16.0669 9.0878 15.9106 9.24408C15.7544 9.40036 15.6666 9.61232 15.6666 9.83333V14.8333C15.6666 15.0543 15.5788 15.2663 15.4225 15.4226C15.2662 15.5789 15.0542 15.6667 14.8332 15.6667H3.16656C2.94555 15.6667 2.73359 15.5789 2.57731 15.4226C2.42103 15.2663 2.33323 15.0543 2.33323 14.8333V3.16667C2.33323 2.94565 2.42103 2.73369 2.57731 2.57741C2.73359 2.42113 2.94555 2.33333 3.16656 2.33333H8.16657C8.38758 2.33333 8.59954 2.24554 8.75582 2.08926C8.9121 1.93298 8.9999 1.72101 8.9999 1.5C8.9999 1.27899 8.9121 1.06702 8.75582 0.910744C8.59954 0.754464 8.38758 0.666667 8.16657 0.666667H3.16656C2.50352 0.666667 1.86764 0.930059 1.3988 1.3989C0.929957 1.86774 0.666565 2.50363 0.666565 3.16667V14.8333C0.666565 15.4964 0.929957 16.1323 1.3988 16.6011C1.86764 17.0699 2.50352 17.3333 3.16656 17.3333H14.8332C15.4963 17.3333 16.1322 17.0699 16.601 16.6011C17.0698 16.1323 17.3332 15.4964 17.3332 14.8333V9.83333C17.3332 9.61232 17.2454 9.40036 17.0892 9.24408C16.9329 9.0878 16.7209 9 16.4999 9ZM3.9999 9.63333V13.1667C3.9999 13.3877 4.0877 13.5996 4.24398 13.7559C4.40026 13.9122 4.61222 14 4.83323 14H8.36657C8.47624 14.0006 8.58496 13.9796 8.68649 13.9381C8.78802 13.8967 8.88037 13.8356 8.95823 13.7583L14.7249 7.98333L17.0916 5.66667C17.1697 5.5892 17.2317 5.49703 17.274 5.39548C17.3163 5.29393 17.3381 5.18501 17.3381 5.075C17.3381 4.96499 17.3163 4.85607 17.274 4.75452C17.2317 4.65297 17.1697 4.5608 17.0916 4.48333L13.5582 0.908333C13.4808 0.830226 13.3886 0.768231 13.287 0.725924C13.1855 0.683617 13.0766 0.661835 12.9666 0.661835C12.8566 0.661835 12.7476 0.683617 12.6461 0.725924C12.5445 0.768231 12.4524 0.830226 12.3749 0.908333L10.0249 3.26667L4.24156 9.04167C4.16433 9.11953 4.10323 9.21188 4.06176 9.31341C4.02029 9.41494 3.99926 9.52366 3.9999 9.63333ZM12.9666 2.675L15.3249 5.03333L14.1416 6.21667L11.7832 3.85833L12.9666 2.675ZM5.66656 9.975L10.6082 5.03333L12.9666 7.39167L8.0249 12.3333H5.66656V9.975Z"
                    fill="#382CDD"></path>
                </svg>
              </a>
              <a class="inline-block">
                <svg width="20" height="20" viewbox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.33333 15C8.55435 15 8.76631 14.9122 8.92259 14.7559C9.07887 14.5996 9.16667 14.3877 9.16667 14.1667V9.16666C9.16667 8.94564 9.07887 8.73368 8.92259 8.5774C8.76631 8.42112 8.55435 8.33332 8.33333 8.33332C8.11232 8.33332 7.90036 8.42112 7.74408 8.5774C7.5878 8.73368 7.5 8.94564 7.5 9.16666V14.1667C7.5 14.3877 7.5878 14.5996 7.74408 14.7559C7.90036 14.9122 8.11232 15 8.33333 15ZM16.6667 4.99999H13.3333V4.16666C13.3333 3.50362 13.0699 2.86773 12.6011 2.39889C12.1323 1.93005 11.4964 1.66666 10.8333 1.66666H9.16667C8.50363 1.66666 7.86774 1.93005 7.3989 2.39889C6.93006 2.86773 6.66667 3.50362 6.66667 4.16666V4.99999H3.33333C3.11232 4.99999 2.90036 5.08779 2.74408 5.24407C2.5878 5.40035 2.5 5.61231 2.5 5.83332C2.5 6.05434 2.5878 6.2663 2.74408 6.42258C2.90036 6.57886 3.11232 6.66666 3.33333 6.66666H4.16667V15.8333C4.16667 16.4964 4.43006 17.1322 4.8989 17.6011C5.36774 18.0699 6.00363 18.3333 6.66667 18.3333H13.3333C13.9964 18.3333 14.6323 18.0699 15.1011 17.6011C15.5699 17.1322 15.8333 16.4964 15.8333 15.8333V6.66666H16.6667C16.8877 6.66666 17.0996 6.57886 17.2559 6.42258C17.4122 6.2663 17.5 6.05434 17.5 5.83332C17.5 5.61231 17.4122 5.40035 17.2559 5.24407C17.0996 5.08779 16.8877 4.99999 16.6667 4.99999ZM8.33333 4.16666C8.33333 3.94564 8.42113 3.73368 8.57741 3.5774C8.73369 3.42112 8.94565 3.33332 9.16667 3.33332H10.8333C11.0543 3.33332 11.2663 3.42112 11.4226 3.5774C11.5789 3.73368 11.6667 3.94564 11.6667 4.16666V4.99999H8.33333V4.16666ZM14.1667 15.8333C14.1667 16.0543 14.0789 16.2663 13.9226 16.4226C13.7663 16.5789 13.5543 16.6667 13.3333 16.6667H6.66667C6.44565 16.6667 6.23369 16.5789 6.07741 16.4226C5.92113 16.2663 5.83333 16.0543 5.83333 15.8333V6.66666H14.1667V15.8333ZM11.6667 15C11.8877 15 12.0996 14.9122 12.2559 14.7559C12.4122 14.5996 12.5 14.3877 12.5 14.1667V9.16666C12.5 8.94564 12.4122 8.73368 12.2559 8.5774C12.0996 8.42112 11.8877 8.33332 11.6667 8.33332C11.4457 8.33332 11.2337 8.42112 11.0774 8.5774C10.9211 8.73368 10.8333 8.94564 10.8333 9.16666V14.1667C10.8333 14.3877 10.9211 14.5996 11.0774 14.7559C11.2337 14.9122 11.4457 15 11.6667 15Z"
                    fill="#E85444"></path>
                </svg>
              </a>
            </td>
          </tr>

        </tbody>
      </table>
      <EdictEquipamento :mostrarModalEdic="mostrarModalEdic" @close="fecharModalEdic"
          @atualizarCliente="atualizarCliente" @excluirCliente="excluirCliente"
          :clienteId="clienteSelecionadoId" ></EdictEquipamento>

    </div>
  </div>

</template>

<script>
import { api } from '../axios-api.js';
import CadEquipamento from '../views/CadEquipamento.vue';
import EdictEquipamento from './EdictEquipamento.vue';


export default {

  components: {
    CadEquipamento,
    EdictEquipamento,
  },
  computed: {




    url() {
      let queryString = "";
      for (let key in this.$route.query) {
        queryString += `${key}=${this.$route.query[key]}`

      }

      return "/pessoas/api/v1/?" + queryString;
    },



  },

  data() {
    return {
      clientes: null,
      mostrarModal: false,
      isEditing: false,
      mostrarModalEdic: false,
      busca: "",
      clientesFiltrados: [],
      clienteSelecionadoId: null,
      // Lista de clientes filtrados         
    };
  },
  methods: {
    buscarClientes() {
      if (this.busca.length ) { // Busca a partir de 2 caracteres
        this.clientesFiltrados = this.clientes.filter(cliente =>
          cliente.nome.toLowerCase().includes(this.busca.toLowerCase())
        );
      } else {
        this.clientesFiltrados = []; // Limpa as sugestões se a busca for muito curta
      }
    },

    abrirModalEdic() {
      this.mostrarModalEdic = true;
    },
    fecharModalEdic() {
      this.mostrarModalEdic = false;
      this.$store.dispatch('clearCliente');
    },



    abrirModal() {
      this.mostrarModal = true;

    },

    fecharModal() {
      this.mostrarModal = false;
      this.$store.dispatch('clearCliente');
      this.isEditing = false;
      this.getClientes();

    },



    getClientes() {

      api.get(this.url).then(response => {

        this.clientes = response.data;

      });

    },
   
    abrirModalCadastro() {
      // Limpar os dados e definir o modo como cadastro


      this.$store.dispatch('clearCliente'); // Limpa os campos e reseta modoEdicao para false
      this.mostrarModal = true; // Abre o modal

    },



    abrirModalEditar(clienteId) {
      //  faz uma requisição à API para buscar os dados completos do cliente
      console.log(this.clienteId);
      this.clienteSelecionadoId = clienteId;


      api.get(`/pessoas/api/v1/${clienteId}`).then(response => {
        const cliente = response.data;

        // Preenche os campos com os dados do cliente
        this.$store.commit('UPDATE_CLIENTE', {
          id: cliente.id,
          nome: cliente.nome,
          cpf: cliente.cpf,
          email: cliente.email,
          cep: cliente.cep,
          rua: cliente.rua,
          numero: cliente.numero,
          bairro: cliente.bairro,
          cidade: cliente.cidade,
          estado: cliente.estado,
          telefone: cliente.telefone
        });

        // Abre o modal
        this.mostrarModalEdic = true;
      });
    },
    atualizarCliente() {
      // Criando o objeto com os dados do cliente que serão atualizados

      const clienteAtualizado = {
        id: this.$store.state.cliente.id,
        nome: this.$store.state.cliente.nome,
        cpf: this.$store.state.cliente.cpf,
        email: this.$store.state.cliente.email,
        cep: this.$store.state.cliente.cep,
        rua: this.$store.state.cliente.rua,
        numero: this.$store.state.cliente.numero,
        bairro: this.$store.state.cliente.bairro,
        cidade: this.$store.state.cliente.cidade,
        estado: this.$store.state.cliente.estado,
        telefone: this.$store.state.cliente.telefone,
      };

      console.log(this.$store.state.cliente.id);
      const clienteId = this.$store.state.cliente.id;


      api.patch(`/pessoas/api/v1/${clienteId}/`, clienteAtualizado)
        .then(() => {
          alert('Cliente atualizado com sucesso!');
          this.fecharModalEdic(); // Fechar o modal após atualização
          // Atualizar a lista de clientes
        })
        .catch(error => {
          console.error('Erro ao atualizar cliente:', error);
        });


    },
    excluirCliente() {
      const clienteId = this.$store.state.cliente.id;

      api.delete(`/pessoas/api/v1/${clienteId}/`)
        .then(() => {
          alert('Cliente Excluido com sucesso!');
          this.fecharModalEdic(); // Fechar o modal após atualização
          // Atualizar a lista de clientes
        })
        .catch(error => {
          console.error('Erro ao excluir cliente:', error);
        });



    }



  },
  watch: {

    url() {
      this.getClientes()

    }


  },
  created() {
    this.getClientes();
  },



  name: "Consultar-cliente",
}
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
@import url('https://cdn.jsdelivr.net/npm/flowbite@2.5.1/dist/flowbite.min.css" rel="stylesheet');
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cutive&family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap');
</style>
