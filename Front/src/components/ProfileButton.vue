<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  username: String
});

const emit = defineEmits();

function openProfile() {
  emit('open-profile', props.username);
}
</script>

<template>
  <button @click="openProfile" class="profile-button">
    {{ username }}
  </button>
</template>
  
<style scoped>
.profile-button {
  background-color: transparent;
  border: none;
  color: inherit;
  cursor: pointer;
}
.profile-button:hover {
  background-color: transparent;
  border: none;
  color: inherit;
  text-decoration: underline;
  cursor: pointer;
}
</style>
