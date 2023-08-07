<script setup lang="ts">
import axios from "axios"
import { onMounted, ref } from "vue";

const users = ref([]);

onMounted(async () => {
    try {
      const res = await axios.get("http://localhost:3000/user/get");
      users.value = res.data;
      console.log(res.data);
    }
    catch (error) {
        alert(error);
        console.log(error);
    }
});
</script>

<template>
<table class="table table-dark">
  <thead>
    <tr>
      <th scope="col">loggin42</th>
      <th scope="col">username</th>
      <th scope="col">status</th>
      <th scope="col">elo</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(user, index) in users">
        <th scope="row">{{ user.loggin42  }}</th>
        <td> {{ user.username }}</td>
        <td> {{ user.status }}</td>
        <td> {{ user.elo  }}</td>
    </tr>
  </tbody>
</table>
</template>