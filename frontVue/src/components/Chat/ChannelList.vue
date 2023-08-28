<script setup lang="ts">
import {ref, computed, defineEmits, defineProps} from 'vue';
import ChannelButton from './ChannelButton.vue';
import CreateChannel from './CreateChannel.vue';
import axios from 'axios';


const emit = defineEmits();

const { channelName } = defineProps({
  channelName: Object
});
const data: any = await axios.get('http://localhost:3000/chat/all', {headers: {
	'token':localStorage.getItem('jwt_token')
	}
});
const channels = ref(Array.from({length: data.data.length }, (_, i) => ({
  id: i + 1,
  name: data.data[i].id
})));
const searchTerm = ref('');
const showSearchBar = ref(false);
const showCreateChannel = ref(false);

const toggleSearchBar = () => {
  showSearchBar.value = !showSearchBar.value;
};

const numberOfPrivateMessages = 10;
const privateMessages = ref(Array.from({ length: numberOfPrivateMessages }, (_, i) => ({
  id: i + 1,
  name: `Private Message ${i + 1}`
})));

const currentView = ref('channels');

const toggleView = () => {
  currentView.value = currentView.value === 'private' ? 'channels' : 'private';
};

function handleSelected(name: string)
{
  console.log("LESSGOOO" + name );
  emit('channel-selected', name);
}
</script>


<template>
  <div class="channel-list">
    <div class="header-section">
      <button @click="toggleSearchBar" class="search-toggle">🔍</button>
      <h3 @click="toggleView">{{ currentView === 'private' ? 'Private Messages' : 'Channels' }}</h3>
      <button @click="showCreateChannel = !showCreateChannel" class="channel-create">+</button>
      <CreateChannel v-if="showCreateChannel" @close="showCreateChannel = false" />
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

    <div v-if="currentView === 'private'">
    	<div class="channel-scroll">
      	<!-- Display filtered channels based on search term and current view -->
      	<ChannelButton
        	v-for="channel in privateMessages"
       	 :key="channel.id"
      	  :channel="channel" @channel-selected="channel.name =  'test'"
     	 />yy
    	</div>
    </div>
    <div v-else>
    	<div class="channel-scroll">
      	<!-- Display filtered channels based on search term and current view -->
      	<ChannelButton
        	v-for="channel in channels"
       	 :key="channel.id"
          :channel="channel" @channel-selected=handleSelected($event)
     	 />
    	</div>
    </div>

  </div>
</template>



  

<style scoped>
.header-section {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  color: #ffffff; /* grey text */
}

.channel-list {
  height: 94.3vh;
  /* width: 25%; */
  border-right: 1px solid #a8abae; /* grey border */
  overflow: hidden;
  /* background-color: #6c757d;  */
  margin: 0;  
  padding: 0;
}

h3 {
  background: #6c757d; /* grey background */
  color: rgb(255, 255, 255); /* white text */
  padding: 10px 20px;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.4s ease;
  text-align: center;
  margin: 5px 0;
  flex:1;
}

h3:hover {
  background: #888888; /* slightly darker grey */
}

.channel-scroll {
  max-height: 85vh;
  overflow-y: auto;
  margin: 0; 
  padding: 0;
}

.search-bar {
  width: 100%;
  padding: 10px;
  border: none;
  margin-bottom: 5px;
  border-radius: 5px;
  outline: none;
  background-color: #505050; 
  color: #ffffff;
  transition: max-height 0.3s ease;
  overflow: hidden;
}
.search-bar::placeholder {
    color: #a8a8a8; /* Placeholder color */
}

.search-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  margin-right: 10px;
  transition: color 0.3s ease;
  color: white; /* white text */
}

.search-toggle:hover {
  color: #6d757d; /* grey text */
}

.place-holder{
  color: #a8a8a8;
}

.slide-fade-enter-active {
  transition: opacity 0.5s ease, transform 0.6s ease;
}
.slide-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.3s ease;
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
  color: rgb(45, 45, 45); /* white text */
}

.channel-create:hover {
  color: #81868b; /* grey text */
}
</style>
