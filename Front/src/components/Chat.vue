<script setup lang="ts">
import { ref } from 'vue';
import ChannelList from './ChannelList.vue';
import ChatWindow from './ChatWindow.vue';
import ProfileWindow from './ProfileWindow.vue';

const selectedUsername = ref(null);

function handleOpenProfile(username) {
  selectedUsername.value = username;
  console.log('Current selected username:', selectedUsername.value);
}

const selectedChannel = ref({ id: 1, name: 'General' });

</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Channels Column -->  
      <ChannelList  />
      <!-- Chat Window -->
      <ChatWindow :currentChannel="selectedChannel" @open-profile="handleOpenProfile"/>
      <!-- Profile Window -->
      <ProfileWindow :username="selectedUsername"/>
    </div>
  </div>
</template>

<style>
</style>
