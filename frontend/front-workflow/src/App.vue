<template>
  <div id="app">
    <TheHeader/>
  </div>
  <router-view></router-view>
</template>

<script>
import TheHeader from "@/components/TheHeader";

export default {
  components:
  {
    TheHeader

  }

};
</script>

<style></style>
