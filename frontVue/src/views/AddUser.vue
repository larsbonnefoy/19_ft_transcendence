<script setup lang="ts">

import {ref} from 'vue';
import axios from "axios";


const loggin = ref('');
const username = ref('');

const submitForm = async () => {
    console.log(username.value);
    console.log(loggin.value);
    try {
        const res = await axios.get('http://localhost:3000/user/add', { params: { loggin42: loggin.value, username : username.value } });
        console.log(res);
    }
    catch (error) {
        console.error('Error:', error);
      }
    }
</script>

<template>
    <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Add User
          </div>
          <div class="card-body">
            <form>
              <div class="form-group">
                <input v-model="loggin" type="text" class="form-control" id="loggin42" placeholder="loggin42">
              </div>
              <br>
              <div class="form-group">
                <input v-model="username" type="text" class="form-control" id="username" placeholder="username">
              </div>
              <br>
              <div class="d-flex justify-content-between">
              <button @click.prevent="submitForm" type="submit" class="btn btn-outline-info">Add</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
