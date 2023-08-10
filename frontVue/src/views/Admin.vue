<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();

const navigateToHome = () => {
      router.push('/home');
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
                <input type="text" class="form-control" id="username" placeholder="Enter username">
              </div>
              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password">
              </div>
              <br>
              <div class="d-flex justify-content-between">
              <button @click="navigateToHome" type="submit" class="btn btn-outline-info">Login</button>
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
