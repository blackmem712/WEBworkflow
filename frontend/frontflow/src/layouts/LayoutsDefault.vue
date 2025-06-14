<template>
    <div>
      <TheHeader />
  
     
      <div class="p-4 sm:ml-64 bg-[#e2e8f0] min-h-screen">
        <slot />
      </div>
    </div>
</template>
  
<script setup>
  import TheHeader from '@/components/TheHeader.vue'
</script>