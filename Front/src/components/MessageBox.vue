<script lang="ts">
import { defineProps, ref, onUpdated, emit } from 'vue';

export default {
  props: {
    messages: Array
  },
  setup(props, { emit }) {
    const messageBoxRef = ref(null);
    const lastMessageRef = ref(null);

    onUpdated(() => {
      emit('updated');
    });

    return {
      messageBoxRef,
      lastMessageRef
    };
  }
}
</script>

<template>
    <div class="message-box" ref="messageBoxRef">
      <div v-for="(message, index) in messages" :key="message.id" class="message" 
           :ref="index === messages.length - 1 ? 'lastMessageRef' : null">
        <div class="message-user">
          <strong>{{ message.sender === 'me' ? 'You' : message.user }}</strong>
        </div>
        <div class="message-content">
          {{ message.content }}
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
  border-bottom: 1px solid #eee;
  margin-bottom: 5px;
}

.message-user {
  margin-bottom: 5px;
  color: #888;
}

.message-content {
  background-color: #f2f3f5;
  padding: 8px 12px;
  border-radius: 12px;
  display: inline-block;
  max-width: 80%;
}
</style>
