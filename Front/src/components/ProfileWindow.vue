<script setup lang="ts">
import { ref } from 'vue';

// Dummy user data for demo purposes. In a real-world app, this might come from a store or an API call.
const user = ref({ id: 1, name: 'John Doe' });
</script>

<template>
    <div class="user-profile">
      <h3>User Profile</h3>
      <!-- Placeholder for user details -->
      <p>Name: {{ user.name }}</p>
      <!-- Add more fields as needed -->
    </div>
  </template>
  
  <style>
  .user-profile {
    width: 33%;
    padding: 20px;
    border: 1px solid #dee2e6;
    border-radius: 5px;
  }
  </style>
  