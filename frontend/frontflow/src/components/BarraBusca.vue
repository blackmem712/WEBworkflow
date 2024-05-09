<template>
 <form>
    <div class="search-box">
        <input type="text" id="busca" name="busca"   class="search-text" placeholder="Pesquisar o cliente..." v-model="busca">
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

 
</style>
