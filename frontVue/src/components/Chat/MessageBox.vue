<script setup lang="ts">
import { ref, onUpdated } from 'vue';
import ProfileButton from './ProfileButton.vue';
const props = defineProps({
  messages: Array
});

const emit = defineEmits();

const messageBoxRef = ref(null);
const lastMessageRef = ref(null);

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
    <div v-for="(message,  index) in messages" :key="message?.id" class="message"
         :class="{ 'sent-by-me': message?.sender}"
         :ref="index === messages?.length - 1 ? 'lastMessageRef' : null">
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
