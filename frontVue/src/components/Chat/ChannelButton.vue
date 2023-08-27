<template>
  <button class="channel-button" @click="selectChannel">
    {{ channel.name }}
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

// Props
const { channel } = defineProps({
  channel: Object
});

// Methods
const selectChannel = () => {
  console.log(`Selected: ${channel.name}`);

};
</script>


<style scoped>

.channel-button {
  padding: 15px 25px 15px 20px; /* Increase the right padding to create a bigger gap */
  border: none;
  background-color: #7289da;
  color: white;
  border-radius: 5px;
  text-align: left;
  transition: background-color 0.3s ease;
  display: block;
  width: 99.5%;
  margin-bottom: 2px; /* Increase the margin-bottom to create a bigger gap between buttons */
}
.channel-button:hover {
  background-color: #5b6eae;
}
</style>
