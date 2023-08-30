<script setup lang="ts">
import { ref, onUpdated } from 'vue';
import ProfileButton from './ProfileButton.vue';
import { useChatStore, useChannelStore} from '@/stores/chat';
import { Channel } from '@/types';
import axios from 'axios';

const chat = useChatStore();
const channel = useChannelStore();

const emit = defineEmits();

const messageBoxRef = ref(null);
const me: any = (await axios.get('http://localhost:3000/user/me/login42', {
  headers:
      {
        'token':localStorage.getItem('jwt_token')
      }
})).data;
onUpdated(() => {
  emit('updated');
});

function handleProfileClick(username: string) {
  emit('open-profile', username);
}
// console.log(messages[3].sender);
</script>

<template>
  <div class="message-box" ref="messageBoxRef">
    <div v-for="(message,  index) in channel?.getmMessages" :key="index" class="message"
         :class="{ 'sent-by-me': (message?.user.login42 === me)}">
      <div class="message-user">
        <ProfileButton :username="message?.user   ? 'You' : message?.user" @open-profile="handleProfileClick"/>
      </div>
      <div class="message-content">
        {{ message?.messages }}
      </div>
    </div>
  </div>
</template>

  
<style scoped>
.message-box {
  flex: 1;
  overflow: auto;
}

.message {
  padding: 10px;
  margin-bottom: 5px;
}

.message-user {
  margin-bottom: 5px;
  color: #888;
}

.message-content {
  background-color: #f2f3f5;
  color: black;
  padding: 8px 12px;
  border-radius: 12px;
  display: inline-block;
  max-width: 80%;
  white-space: normal;      /* Allow text to wrap */
  word-wrap: break-word;    /* Break long words */
}

.sent-by-me {
  text-align: right;
}

.sent-by-me .message-user {
  margin-bottom: 5px;
  color: #888;
}

.sent-by-me .message-content {
  background-color: #e2f0fb; 
  display: inline-block;
  max-width: 80%;
  white-space: normal;    
  word-wrap: break-word;   
}
</style>
