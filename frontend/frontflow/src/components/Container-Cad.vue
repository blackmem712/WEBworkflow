<template>
  <div class="main-container">
    <Router-view/>
  </div>
</template>

<script>


export default {
 
  name: 'Container-Cad',
};
</script>

<style >

.sidebar ~ .main-container {
  margin-left: 79px !important;
 
}
.sidebar.open ~ .main-container {
  margin-left: 250px !important;
  
}
.main-container {
  position: relative;
  min-height: 100vh;
  background: #2a2a2a63;
  color: white;
  width: 100%;
  transition: all 0.4s ease;
  z-index: 6;
  margin-left: 250px;

  
}


</style>