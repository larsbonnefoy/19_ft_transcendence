<script setup lang="ts">
import { useRouter} from 'vue-router'
// import { process } from '@types/node'

const router = useRouter();

const navigateToHome = () => {
      router.push('/home');
};
const loginWith42 = () => {
  /*
    check if valid token first, then redir to home
    ca fait un double check du token vu qu'il est recheck au moment du load de home
  */
  window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-420d7dc50567706ef53ee6496c9d2959e43f46727608cf99aa3e85ca68219411&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth&response_type=code`;
}
</script>

<template>
<div class="fullscreen-background">
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Login
          </div>
          <div class="card-body">
            <form>
              <div class="d-flex justify-content-between">
              <button @click="navigateToHome" type="submit" class="btn btn-outline-info">Login</button>
              <button @click.prevent="loginWith42" type="submit" class="btn btn-outline-info">LoginWith42</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<style scoped >
.fullscreen-background {
    
    /* Set background image and styles */
    background-image: url('backgroundv2.jpg');
    background-size: cover;
    background-repeat: no-repeat;

    position: fixed;
    /* Reset margin and padding */

    /* Set full viewport height */
    width: 100%;
    height: 100%;
}
</style>
