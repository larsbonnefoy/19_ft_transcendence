<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; 
import ChannelList from './ChannelList.vue';
import ChatWindow from './ChatWindow.vue';
import ProfileWindow from './ProfileWindow.vue';

const selectedUser = ref(null);

function handleOpenProfile(user: string) {
  selectedUser.value = user;
  console.log('Current selected user:', selectedUser.value);
}

const selectedChannel = ref({ id: 1, name: 'General' });

const route = useRoute(); // Get current route object

onMounted(() => {
  const chatName = route.params.chatName; 
  console.log("Captured chat name from URL:", chatName);
});
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Channels Column -->  
      <ChannelList  />
      <!-- Chat Window -->
      <ChatWindow :currentChannel="selectedChannel" @open-profile="handleOpenProfile"/>
      <!-- Profile Window -->
      <ProfileWindow :user="selectedUser"/>
    </div>
  </div>
</template>

<style>
</style>
