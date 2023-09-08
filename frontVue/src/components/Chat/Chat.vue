<script setup lang="ts">
import {ref, onMounted, nextTick, watch} from 'vue';
import { useRoute } from 'vue-router'; 
import axios from 'axios';
import ChannelList from './ChannelList.vue';
import ChatWindow from './ChatWindow.vue';
import ProfileWindow from './ProfileWindow.vue';
import SocialsList from '@/components/Socials/SocialsList.vue';
import { useChannelStore, useChatStore } from '@/stores/chat';
import { type UserInfo } from '@/types';

const selectedUser = ref("");
const selectedChannel = ref("" );
const channel = useChannelStore();


function handleSelectedProfile(user: string) {
  selectedUser.value = user
  console.log("chat : "+ selectedUser.value)
  console.log(selectedUser.value)
}

// let me : string
// try
// {
//    me = (await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/me/login42`, {
//     headers:
//         {
//           'token':localStorage.getItem('jwt_token')
//         }
//   })).data;
// }
// catch (error)
// {
//   me = '';
// }
async function handleSelectedChannel(event: string)
{
  // await handleChannel(event);
  console.log('BOIII'+event);
  // console.log(messages.value)
  selectedChannel.value = event;
    isChatter.value = false
}


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
