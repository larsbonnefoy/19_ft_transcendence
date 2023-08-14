<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import {ref} from 'vue'
import axios, { AxiosError } from 'axios';

const router = useRouter();

const login = ref("");
const wrongLogin = ref(false);
async function navigateToHome() {
  try {
    if (login.value != "") {
      /* Check if user exists first*/
      await axios.get(`http://localhost:3000/user/UserFromLog:${login.value}`)
      const response : any = await axios.get('http://localhost:3000/api42/admin', { 
        params: {
          login42: login.value
        }
      })
      sessionStorage.setItem('jwt_token', response.data.jwt_token);
      router.push('/home');
    }
  }
  catch (error: any){
    wrongLogin.value = true;
    console.error(error.name + ": " + error.message);
  }
};

</script>

<template>
<div class="fullscreen-background">
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Admin
          </div>
          <div class="card-body">
            <form>
              <div class="form-group">
                <label for="username">Username</label>
                <input v-model="login" type="text" class="form-control" id="username" placeholder="Enter username">
              </div>
              <p v-if="wrongLogin" style="color: red;" class="small"> Wrong Username </p>
              <br>
              <div class="d-flex justify-content-between">
              <button @click.prevent="navigateToHome" type="submit" class="btn btn-outline-info">Login</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>