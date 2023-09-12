<script setup lang="ts">
import {ref, onMounted} from 'vue';
import { useRoute } from 'vue-router'; 
import ChannelList from './ChannelList.vue';
import ChatWindow from './ChatWindow.vue';
import ProfileWindow from './ProfileWindow.vue';

const selectedUser = ref("");
const selectedChannel = ref("" );

function handleSelectedProfile(user: string) {
  selectedUser.value = user
}

async function handleSelectedChannel(event: string)
{

  selectedChannel.value = event;
}


const route = useRoute(); // Get current route object

onMounted(() => {
  const chatName = route.params.chatName; 
  // console.log("Captured chat name from URL:", chatName);
});


</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3">
        <!-- Channels Column -->  
        <ChannelList
            @channel-selected=" handleSelectedChannel"
        />
      </div>
      <div class="col-6">
        <ChatWindow
                :selectedChannel="selectedChannel"
                @open-profile="handleSelectedProfile"
        />
      </div>
      <div class="col-3">
        <!-- Profile Window -->
        <ProfileWindow :user="selectedUser"/>
      </div>
    </div>
  </div>
</template>

<style>
</style>
