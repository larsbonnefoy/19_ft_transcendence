<script setup lang="ts">
import HeaderBar from './components/HeaderBar.vue'
</script>

<template>
  <div class="bg-secondary vh-100 text-light">
    <HeaderBar></HeaderBar>
    <Suspense>
      <RouterView></RouterView>
    </Suspense>
  </div>
</template>

<style>
</style>
