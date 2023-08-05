<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();
const route = useRoute();

const navigateToHome = () => {
      router.push('/home');
    };

    const navigateToRegister = () => {
      router.push('/createAccount');
    };

</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Login
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
              <button @click="navigateToHome" type="submit" class="btn btn-outline-primary">Login</button>
              <button @click="navigateToRegister" type="submit" class="btn btn-outline-secondary">Don't have an account?</button>
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