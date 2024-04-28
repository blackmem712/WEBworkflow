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

<style scoped>

 @import url('https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css');

.search-box{
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
.search-text{

  background-color: none;
  border: 0;
  outline: 0;
  font-size: 16px;

}
.bx-search{
    
   color: black;

}

</style>
