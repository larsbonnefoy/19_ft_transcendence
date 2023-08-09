<script setup lang="ts">
import HeaderBar from './components/HeaderBar.vue'
</script>

<template>
  <div class="bg-dark vh-100 text-light">
    <HeaderBar></HeaderBar>

    <RouterView></RouterView>
  </div>
</template>

<style>
</style>
