<script setup lang="ts">
import axios from "axios"
import { onMounted, ref } from "vue";

const users:any = ref([]);

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
      <th scope="col">login42</th>
      <th scope="col">username</th>
      <th scope="col">elo</th>     
      <th scope="col">status</th> 
      <th scope="col">friends</th>
      <th scope="col">Win(s)</th>
      <th scope="col">Loss(es)</th>
      <th scope="col">Avatar</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(user, index) in users">
        <th scope="row">{{ user.login42  }}</th>
        <td> {{ user.username }}</td>
        <td> {{ user.elo  }}</td>
        <td> {{ user.status }}</td>
        <td> {{ user.friends }}</td>
        <td> {{ user.win }}</td>
        <td> {{ user.loss }}</td>
        <td> {{ user.photo }}</td>
    </tr>
  </tbody>
</table>
</template>