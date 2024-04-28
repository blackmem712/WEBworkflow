<template>
    <b-container>
      <TheHeader></TheHeader>
      <ContainerCad>
        <router-view></router-view>
      </ContainerCad>
  </b-container>
  </template>
  
  <script>
  import TheHeader from './components/TheHeader.vue';
  import ContainerCad from './components/Container-Cad.vue';
  
  export default {
    components: {
      TheHeader,
      ContainerCad
    }
  }
  </script>
<style scoped>

</style>
