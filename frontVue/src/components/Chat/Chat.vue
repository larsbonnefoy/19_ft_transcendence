<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; 
import ChannelList from './ChannelList.vue';
import ChatWindow from './ChatWindow.vue';
import ProfileWindow from './ProfileWindow.vue';
import SocialsList from '@/components/Socials/SocialsList.vue';

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
      <div class="col-3">
        <!-- Channels Column -->  
        <ChannelList/>
      </div>
      <div class="col-6">
        <!-- Chat Window -->
        <ChatWindow :currentChannel="selectedChannel" @open-profile="handleOpenProfile"/>
      </div>
      <div class="col-3">
        <!-- Profile Window -->
        <ProfileWindow :user="selectedUser"/>
        <!-- <SocialsList></SocialsList> -->
      </div>
    </div>
  </div>
</template>

<style>
</style>
