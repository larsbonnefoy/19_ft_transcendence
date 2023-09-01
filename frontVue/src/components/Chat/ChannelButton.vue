<script setup lang="ts">
import { useChatStore, useChannelStore} from '@/stores/chat';
import { type Channel } from '@/types';

const chat = useChatStore();
const channelStore = useChannelStore();

// Props
 const { channel } = defineProps({
  channel: Object
});

// Methods
const selectChannel = async () => {
  if (channel && chat)
  {
    console.log(`Selected: ${channel.id}`);
    const newChannel: Channel | undefined = chat.getChannels?.find((it: Channel) => {return (it.id === channel.id)})  
    if (newChannel)
    {
      console.log(newChannel);
      await channelStore.setChannel(newChannel);
    }
    // console.log(channelStore.getMessages);
    console.log("done");
  }
  // emit('channel-selected',  channel.id);
};
</script>

<template>
  <button class="channel-button" @click="selectChannel">
    {{ channel?.name }}
  </button>
</template>


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
