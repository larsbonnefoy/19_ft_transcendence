<script setup lang="ts">
import { ref, defineProps, watchEffect } from 'vue';

const props = defineProps({
  username: String
});

const user = ref({ name: props.username });

// Watch the username prop and update the user.name value when it changes
watchEffect(() => {
  user.value.name = props.username;
});

</script>

<template>
  <div class="user-profile">
    <h3>User Profile</h3>
    <p>Name: {{ user.name }}</p>
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
