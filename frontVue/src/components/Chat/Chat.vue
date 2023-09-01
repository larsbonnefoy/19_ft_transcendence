<script setup lang="ts">
import {ref, onMounted, nextTick, watch} from 'vue';
import { useRoute } from 'vue-router'; 
import ChannelList from './ChannelList.vue';
import ChatWindow from './ChatWindow.vue';
import ProfileWindow from './ProfileWindow.vue';
import SocialsList from '@/components/Socials/SocialsList.vue';
import axios from "axios";
import { type UserInfo } from '@/types';

const selectedUser = ref("");
const emits = defineEmits();

function handleSelectedProfile(user: string) {
  selectedUser.value = user
  console.log("chat : "+ selectedUser.value)
  console.log(selectedUser.value)
  // console.log('Current selected user:', selectedUser.value);
}

const selectedChannel = ref("" );

let messages: any;



const route = useRoute(); // Get current route object

onMounted(() => {
  const chatName = route.params.chatName; 
  console.log("Captured chat name from URL:", chatName);
});

async function handleSelectedChannel(event: string)
{
  // await handleChannel(event);
  console.log('BOIII'+event);
  // console.log(messages.value)
  selectedChannel.value = event;

}
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
        <!-- Chat Window -->
        <ChatWindow
                :selectedChannel="selectedChannel"
                :messages="messages"
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
