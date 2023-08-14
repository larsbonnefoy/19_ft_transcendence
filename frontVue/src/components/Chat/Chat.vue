<script setup lang="ts">
import { ref } from 'vue';
import ChannelList from './ChannelList.vue';
import ChatWindow from './ChatWindow.vue';
import ProfileWindow from './ProfileWindow.vue';

// Components for template
const components = { ChannelList, ChatWindow };

// Dummy channel for the demo. In a real-world app, this might come from selecting a channel in ChannelList.
const selectedChannel = ref({ id: 1, name: 'General' });
</script>


<template>
  <div class="container-fluid">
    <div class="row">
      <!-- Channels Column -->  
      <ChannelList  />
      <!-- Chat Window -->
      <ChatWindow :currentChannel="selectedChannel"/>
      <!-- Profile Window -->
      <ProfileWindow />
    </div>
  </div>
</template>

<style>
</style>

