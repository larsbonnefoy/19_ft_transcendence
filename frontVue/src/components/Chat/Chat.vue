<script setup lang="ts">
import {ref, onMounted, defineEmits, nextTick, watch} from 'vue';
import { useRoute } from 'vue-router'; 
import ChannelList from './ChannelList.vue';
import ChatWindow from './ChatWindow.vue';
import ProfileWindow from './ProfileWindow.vue';
import SocialsList from '@/components/Socials/SocialsList.vue';
import axios from "axios";

const selectedUser = ref("");
const emits = defineEmits();
function handleOpenProfile(event: string) {
  selectedUser.value = event;
  console.log('Current selected user:', selectedUser.value);
}

const selectedChannel = ref("" );


const me = (await axios.get('http://localhost:3000/user/me/login42', {
  headers:
      {
        'token':localStorage.getItem('jwt_token')
      }
})).data;

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

  async function handleChannel(event: string) {
  console.log(` test: ${event}`);
  const roomId : string | undefined= event
  try
  {
   const data : any =  await axios.get(`http://localhost:3000/chat/room:${roomId}`, {
     headers:
         {
           'token':localStorage.getItem('jwt_token')
         }
   });
   console.log(data)
  //  messages.value = data.data;
    if(data.status != 200)
      throw "error";
    // messages =  ref(Array.from({length: data.data.length }, (_, i) => ({
    //  id: i+1,
    //  user: data.data[i].user.username,
    //  content : data.data[i].message,
    //  sender: data.data[i].user.login42 === me
  //  })));
  }
  catch (error)
  {
    messages.value = [];
  }
}
// console.log("BOOOOP" + props.selectedChannel)

// await watch(async () => await selectedChannel.value, handleChannel);
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3">
        <!-- Channels Column -->  
        <ChannelList
            @channel-selected=" handleSelectedChannel($event)"
            @channel=" handleChannel($event)"
        />
      </div>
      <div class="col-6">
        <!-- Chat Window -->
        <ChatWindow
                                    :selectedChannel="selectedChannel"
                                    :messages="messages"
                                    @open-profile="handleOpenProfile($event)"
        />
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
