<script setup lang="ts">
import { ref, nextTick, defineEmits } from 'vue';
import MessageBox from './MessageBox.vue';

const newMessage = ref("");
const messages = ref([
  { id: Date.now() - 2, user: "Alice", content: "Hey there!", sender: 'other' },
  { id: Date.now() - 1, user: "Bob", content: "How are you?", sender: 'other' }
]);
const chatContainerRef = ref(null);
const endOfChatRef = ref(null);

const emit = defineEmits();

const sendMessage = () => {
  if (newMessage.value.trim()) {
    messages.value.push({ id: Date.now(), user: "You", content: newMessage.value, sender: 'me' });
    newMessage.value = "";
    nextTick(() => {
      autoScroll();
    });
  }
};

const autoScroll = () => {
    if (endOfChatRef.value) {
        endOfChatRef.value.scrollIntoView({ behavior: 'smooth' });
    }
};

const handleUpdate = () => {
    console.log("MessageBox updated!"); 
    autoScroll();
};

function handleOpenProfile(username: string) {
  emit('open-profile', username);
}
</script>


<template>
  <div class="chat-window" ref="chatContainerRef">
    <MessageBox :messages="messages" class="chat-messages" @updated="autoScroll" @open-profile="handleOpenProfile" />
    <button @click="autoScroll" class="scroll-to-bottom">Scroll to Bottom</button>
    <div class="chat-input-container">
      <input v-model="newMessage" @keydown.enter="sendMessage" placeholder="Type a message..." />
      <button @click="sendMessage" class="send-button">Send</button>
    </div>
    <div id="endOfChat" ref="endOfChatRef"></div>
  </div>
</template>

<style scoped>
.chat-window {
    height: 100vh;
    width: 42%;
    border-left: 1px solid #dee2e6;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0;
}

.scroll-to-bottom {
    margin: 10px 0;
    background-color: #007BFF;
    color: white;
    border: none;
    padding: 5px 10px;
    cursor: pointer;
    border-radius: 3px;
    transition: background-color 0.3s;
}

.scroll-to-bottom:hover {
    background-color: #0056b3;
}

/* Chat Input Container */
.chat-input-container {
    padding: 0.5rem;
    display: flex;
    align-items: center; /* Vertically center the items */
    border-radius: 50px; /* Circular edges */
    background-color: #f7f7f8; /* Slight grey background for contrast */
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    position: relative; /* To position the send button absolutely */
}

/* Chat Input (Text field) */
.chat-input-container input {
    flex: 1;
    padding: 0.5rem 1rem; /* Increased padding for comfort */
    padding-right: 3rem; /* Space for the "Send" button */
    font-size: 1rem;
    border: none; /* Remove border */
    border-radius: 40px; /* Circular edges */
    outline: none; /* Remove default focus outline */
    background-color: transparent; /* Transparent background to blend with the container */
    transition: box-shadow 0.3s, background-color 0.3s; /* Smooth transitions */
    height: 100%; /* Take full height of the container */
    border-top-right-radius: 0; /* Make the top right edge square */
    border-bottom-right-radius: 0; /* Make the bottom right edge square */
    border-right: 1px solid #dee2e6; /* Add a right border to visually separate the input from the button */

}

.chat-input-container input::placeholder {
    color: #a8a8a8; /* Placeholder color */
}

/* Send Button */
.chat-input-container .send-button {
    position: absolute;
    right: 0; 
    background-color: #007BFF; 
    color: #ffffff; 
    border: none;
    padding: 0.5rem 1rem; 
    border-top-left-radius: 0; 
    border-bottom-left-radius: 0; 
    border-top-left-radius: 25px;
    border-bottom-left-radius: 25px; 
    border-top-right-radius: 25px; 
    border-bottom-right-radius: 25px; 
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s; 
    outline: none; 
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
    height: 100%; 
}

.chat-input-container .send-button:hover {
    background-color: #0056b3;
} 

.chat-input-container .send-button:active {
    transform: scale(0.97); 
}

</style>
  
