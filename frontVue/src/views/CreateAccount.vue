<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter();

const navigateToLogin = () => {
      router.push('/');
    };
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            Create Account With 42Api
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
              <div class="form-group">
                <label for="password">Check Password</label>
                <input type="password" class="form-control" id="password" placeholder="Password">
              </div>
              <br>
              <div class="d-flex justify-content-between">
              <button @click="navigateToLogin" type="submit" class="btn btn-outline-primary">Create!</button>
              <button @click="navigateToLogin" type="submit" class="btn btn-outline-secondary">Already have an Account?</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>