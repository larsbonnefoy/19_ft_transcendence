.<script setup lang="ts">
import { ref, onUpdated } from 'vue';
import ProfileButton from './ProfileButton.vue';
import { useChannelStore} from '@/stores/chat';
import axios from 'axios';

const channel = useChannelStore();

const emit = defineEmits();

const messageBoxRef = ref(null);
const me: any = (await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/me/login42`, {
  headers:
      {
        'token':localStorage.getItem('jwt_token')
      }
})).data;
onUpdated(() => {
  emit('updated');
});

function handleProfileClick(login: string) {
  emit('open-profile', login);
}
// console.log(messages[3].sender);
</script>

<template>
  <div class="message-box" ref="messageBoxRef">
    <div v-for="(message,  index) in channel?.getMessages" :key="index" class="message"
         :class="{ 'sent-by-me': (message?.user.login42 === me)}">
      <div class="message-user">
        <ProfileButton 
          :username="message?.user.login42 === me   ? 'You' : message?.user.username" @open-profile="handleProfileClick"
          :login="message?.user.login42"
          />
      </div>
      <div class="message-content">
        {{ message.message }} 
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
