<template>
<div>
 <TheHeader></TheHeader>
 <ContainerCad>
  <Router-view/>
 </ContainerCad>
  
 </div>
</template>

<script>
import TheHeader from './components/TheHeader.vue';
import ContainerCad from './components/Container-Cad.vue';

export default{

    components:{
    TheHeader,
    ContainerCad,
    
}
}

</script>

<style>
*{
    margin: 0px;
    padding: 0px;
    box-sizing: border-box;  
    font-family: "Poppins" , sans-serif;
  }
  main{
      position: relative;
      min-height: 100vh;
      top: 0;
      background: #2A2A2A;
      left: 78px;
      color: white;
      width: calc(100% - 78px);
      transition: all 0.5s ease;
      z-index:2;
  }
  
</style>
