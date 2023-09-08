<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ChannelButton from './ChannelButton.vue';
import CreateChannel from './CreateChannel.vue';
import JoinChannel from './JoinChannel.vue';
import axios from 'axios';
import { useChatStore } from '@/stores/chat';
import { socket } from '@/socket';

const chat = useChatStore();

await chat.fetchChannels();

const searchTerm = ref('');
const showSearchBar = ref(false);
const showCreateChannel = ref(false);
const showJoinChannel = ref(false);
const hasPass = ref(false);
const channelId = ref<number>(-1)

const toggleSearchBar = () => {
  showSearchBar.value = !showSearchBar.value;
};

const currentView = ref('public');

const toggleView = () => {  // HUGO CHANGE CES VALEURS, ELLES SONT PAS JUSTE POUR LES MESSAGES DE GROUPES
  if (currentView.value === 'private') {
    currentView.value = 'channels';
  } else if (currentView.value === 'channels') {
    currentView.value = 'public';
  } else {
    currentView.value = 'private';
  }
};

function ClickJoin(event: any)
{
  console.log("click" + event);
  hasPass.value = event.hasPass;
  channelId.value = event.id;
  showJoinChannel.value = !showJoinChannel.value;
}


</script>

<template>
  <div class="channel-list h-190">
    <div class="header-section">
      <button @click="toggleSearchBar" class="search-toggle">🔍</button>
      <h3 @click="toggleView">
        {{
          currentView === 'private' ? 'Private Messages' : 
          currentView === 'channels' ? 'Group Messages' : 
          'Join Public Channels'
        }}
      </h3>
      <button @click="showCreateChannel = !showCreateChannel" class="channel-create">+</button>
      <CreateChannel v-if="showCreateChannel" @close="showCreateChannel = false" />
      <JoinChannel v-if="showJoinChannel" :hasPass="hasPass" :id="channelId" @close="showJoinChannel = false" />
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
       <template v-for="channel in chat.getChannels">
             	<ChannelButton v-if="channel.isDm"
                  :channel="channel" 
                  :isPublic=false
     	 /></template>
    	</div>
    </div>
    <div v-if="currentView === 'channels'">
    	<div class="channel-scroll">
      	<!-- Display filtered channels based on search term and current view -->
        <template v-for="channel in chat.getChannels">
             	<ChannelButton v-if="!channel.isDm"
               :channel="channel" 
               :isPublic=false
     	        />
      </template>
   
    	</div>
    </div>
    <div v-else>
    	<div class="channel-scroll">
      	<!-- Display filtered channels based on search term and current view -->
        <template v-for="channel in chat.getPublics">
             	<ChannelButton 
               :channel="channel"
               :isPublic=true
               @click="ClickJoin"
     	        />
      </template>
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
  /* width: 25%; */
  height: 94h;
  overflow: hidden;
  background-color: #6c757d; 
  margin: 0;  
  padding: 0;
  display: flex;
  flex-direction: column;
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
  max-height: 80vh;
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
  background-color: #8e8e8e; 
  color: #ffffff;
  transition: max-height 0.3s ease;
  overflow: hidden;
}
.search-bar::placeholder {
    color: #d4d4d4;
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
