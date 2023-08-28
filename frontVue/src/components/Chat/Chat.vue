<script setup lang="ts">
import { ref, onMounted , defineEmits} from 'vue';
import { useRoute } from 'vue-router'; 
import ChannelList from './ChannelList.vue';
import ChatWindow from './ChatWindow.vue';
import ProfileWindow from './ProfileWindow.vue';
import SocialsList from '@/components/Socials/SocialsList.vue';

const selectedUser = ref("");
const emits = defineEmits();
function handleOpenProfile(event: string) {
  selectedUser.value = event;
  console.log('Current selected user:', selectedUser.value);
}

const selectedChannel = ref("" );
selectedChannel.value = "test";

const route = useRoute(); // Get current route object

onMounted(() => {
  const chatName = route.params.chatName; 
  console.log("Captured chat name from URL:", chatName);
});

function handleSelectedChannel(event: string)
{
  console.log('BOIII'+event);
  selectedChannel.value = event;
}
</script>

<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-3">
        <!-- Channels Column -->  
        <ChannelList
            @channel-selected="handleSelectedChannel($event)"
        />
      </div>
      <div class="col-6">
        <!-- Chat Window -->
        <ChatWindow
                                    :selectedChannel="selectedChannel"
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
