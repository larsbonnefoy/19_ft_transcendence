<script setup lang="ts">
import { ref, computed } from 'vue';
import ChannelButton from './ChannelButton.vue';

// State
const numberOfChannels = 30;
const channels = ref(Array.from({ length: numberOfChannels }, (_, i) => ({
  id: i + 1,
  name: `Channel ${i + 1}`
})));

const searchTerm = ref(''); // Track the user's search term
const showSearchBar = ref(false);

const toggleSearchBar = () => {
  showSearchBar.value = !showSearchBar.value;
};

const filteredChannels = computed(() => {
  // Choose the data source based on the currentView
  const source = currentView.value === 'private' ? privateMessages.value : channels.value;
  
  return source.filter(channel => 
  channel.name.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const createChannel = () => {
  // Your logic to create a new channel goes here
  alert('Create new channel functionality goes here.');
};
const numberOfPrivateMessages = 10;
const privateMessages = ref(Array.from({ length: numberOfPrivateMessages }, (_, i) => ({
  id: i + 1,
  name: `Private Message ${i + 1}`
})));

// Track the currently selected view
const currentView = ref('private'); // 'channels' or 'private'

// Methods
const toggleView = () => {
  currentView.value = currentView.value === 'private' ? 'channels' : 'private';
};
</script>


<template>
  <div class="channel-list">
    <div class="header-section">
      <button @click="toggleSearchBar" class="search-toggle">🔍</button>
      <h3 @click="toggleView">{{ currentView === 'private' ? 'Private Messages' : 'Channels' }}</h3>
      <button @click="createChannel" class="channel-create">+</button>
    </div>
    <transition name="slide-fade">
      <input 
        v-show="showSearchBar"
        type="text" 
        v-model="searchTerm" 
        placeholder="Search channels..." 
        class="search-bar" 
      />
    </transition>
    <div class="channel-scroll">
      <!-- Display filtered channels based on search term and current view -->
      <ChannelButton
        v-for="channel in filteredChannels"
        :key="channel.id"
        :channel="channel"
      />
    </div>
  </div>
</template>



  

<style scoped>
.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 10px; /* Existing margin */
}

.channel-list {
  height: 100vh;
  width: 25%;
  border-right: 1px solid #dee2e6;
  overflow: hidden;
  background-color: #f0f0f0;
  margin: 0;  /* Resetting margins */
  padding: 0; /* Resetting padding */
}

h3 {
  background: #f0f0f0;
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.6s ease;
  text-align: center;
  margin: 5px 0; /* Existing margin */
  flex:1;
}

h3:hover {
  background: #e0e0e0;
}

.channel-scroll {
  max-height: calc(100vh - 10vh); /* Dynamically calculated considering other static elements */
  overflow-y: auto;
  margin: 0; /* Resetting margins */
  padding: 0; /* Resetting padding */
}

.search-bar {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 1px solid #d0d0d0;
  margin-bottom: 5px;
  border-radius: 5px;
  outline: none;
  background-color: #d9d9d9;
  transition: max-height 0.3s ease;
  overflow: hidden;
}

.search-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin-right: 10px;
  transition: color 0.3s ease;
}

.search-toggle:hover {
  color: #666;
}

.slide-fade-enter-active {
  transition: opacity 0.5s ease, transform 0.6s ease;
}
.slide-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.3s ease; /* Quicker leave phase */
}
.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(-3px);
}
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}
.channel-create {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin-right: 10px;
  transition: color 0.3s ease;
}

.channel-create:hover {
  color: #666;
}
</style>
