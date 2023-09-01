<script setup lang="ts">

const props = defineProps({
  username: String,
  login: String
});

const emit = defineEmits();

function openProfile() {
  emit('open-profile', props.login);
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
  color: white;
  cursor: pointer;
}
.profile-button:hover {
  background-color: transparent;
  border: none;
  color: white;
  text-decoration: underline;
  cursor: pointer;
}
</style>
