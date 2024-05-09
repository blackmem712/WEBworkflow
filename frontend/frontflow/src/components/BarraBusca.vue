<template>
 <form>
    <div class="">
        <input type="text" id="busca" name="busca" class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none focus:ring" placeholder="Pesquisar o cliente..." v-model="busca">
        <input type="submit" id="lupa" value="Buscar" class="bx bx-search" @click.prevent="buscarProdutos">
      </div>
      
 </form>
</template>
<script>
export default{
    name: 'Barra-Busca',

    data(){
        return{
            busca:""

        };
    },
    methods:
    {
        buscarProdutos(){
            this.$router.push({query:{nome:this.busca}});
            
        }
    }
    
}
</script>

<style >
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';
 
</style>
