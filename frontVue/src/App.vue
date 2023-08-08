<script setup lang="ts">
//import { ref, computed, watch } from 'vue'
//import { useRouter, useRoute } from 'vue-router'
import HeaderBar from './components/HeaderBar.vue'

/* API
const todoId = ref(1)
const todoData = ref(null)

async function fetchData() {
  todoData.value = null
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  todoData.value = await res.json()
}
fetchData()

watch(todoId, fetchData)
*/
/* --- */
</script>

<template>
    <HeaderBar></HeaderBar>

    <RouterView></RouterView>


<!-- 
  <p>Todo id: {{ todoId }}</p>
  <button @click="todoId++">Fetch next todo</button>
  <p v-if="!todoData">Loading...</p>
  <pre v-else>{{ todoData }}</pre>
-->
</template>

<style>
.done {
  text-decoration: line-through;
}
</style>
