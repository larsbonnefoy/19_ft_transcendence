<script setup lang="ts">
import { ref, computed, watch } from 'vue'
let id = 0;
const hideCompleted = ref(false)
const newToDo = ref('');


const toDos = ref( [
  {id: id++, text:'todo1', done: false},
  {id: id++, text:'todo2', done: false},
  {id: id++, text:'todo3', done: false},
  ]
)

function addToDo () {
  let newId:number = toDos.value.length;
  toDos.value.push({id: newId, text: newToDo.value, done:false});
  newToDo.value = '';
}

function removeToDo (todo: Object) {
  toDos.value = toDos.value.filter((t) => t !== todo);
}

const filteredToDos = computed(() => {
  return hideCompleted.value 
  ? toDos.value.filter((t) => !t.done)
  : toDos.value
})

/* API */
const todoId = ref(1)
const todoData = ref(null)

async function fetchData() {
  todoData.value = null
  const res = await fetch(
    `http://localhost:3000/${toDos.value[toDos.value.length - 1].text}?id=${todoId.value}`, {
    // `http://localhost:3000/bonjour`, {
      // method: "POST",
      // body: "this is the body"
    }
    // `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  todoData.value = await res.json()
}
fetchData()

watch(todoId, fetchData)
/* --- */

</script>

<template>
  <form @submit.prevent="addToDo">
  <input v-model="newToDo">
  <button > Add To Do </button>
  </form>
  <ul>
    <li v-for="todo in filteredToDos" :key="todo.id">
      <input type="checkbox" v-model="todo.done">
      <span :class="{done : todo.done}"> {{ todo.text }} </span>
      <button @click="removeToDo(todo)">X</button>
    </li>
  </ul>
  <button @click="hideCompleted = !hideCompleted">
  {{ hideCompleted ? 'Show' : 'Hide' }}
  </button>

  <p>Todo id: {{ todoId }}</p>
  <button @click="todoId++">Fetch next todo</button>
  <p v-if="!todoData">Loading...</p>
  <pre v-else>{{ todoData }}</pre>
</template>

<style>
.done {
  text-decoration: line-through;
}
</style>