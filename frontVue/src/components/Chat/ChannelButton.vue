<script setup lang="ts">
import { ref } from 'vue';
import EditChannel from './EditChannel.vue';  // Importing the EditChannel component
import { useChatStore, useChannelStore } from '@/stores/chat';
import { type Channel } from '@/types';

const chat = useChatStore();
const channelStore = useChannelStore();
const emit = defineEmits();

// Props
const { channel } = defineProps({
  channel: Object
});

// State for context menu and EditChannel modal
const showContextMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const showEditChannel = ref(false);  // State for showing the EditChannel modal

// Methods
const selectChannel = async () => {
  // ... [rest of your code]
};

const handleRightClick = (event: MouseEvent) => {
  event.preventDefault();
  showContextMenu.value = true;
  menuPosition.value = { x: event.x, y: event.y };
};

const openEditChannel = () => {
  showContextMenu.value = false;  // Hide the context menu
  showEditChannel.value = true;   // Display the EditChannel modal
  console.log("modifying : ", channel.id);
};

document.addEventListener('click', () => {
  if (showContextMenu.value) {
    showContextMenu.value = false;
  }
});
</script>

<template>
  <div>
    <button class="channel-button" @click="selectChannel" @contextmenu="handleRightClick">
      {{ channel?.id }}
    </button>
    <div v-if="showContextMenu" :style="{ top: menuPosition.y + 'px', left: menuPosition.x + 'px' }" class="context-menu">
      <div @click="showEditChannel = !showEditChannel">Edit Channel</div>
    </div>
    <EditChannel v-if="showEditChannel" :channel="channel" @close="showEditChannel = false" />  
  </div>
</template>

<style scoped>
.channel-button {
  padding: 15px 25px 15px 20px;
  border: none;
  background-color: #7289da;
  color: white;
  border-radius: 5px;
  text-align: left;
  transition: background-color 0.3s ease;
  display: block;
  width: 99.5%;
  margin-bottom: 2px;
}
.channel-button:hover {
  background-color: #5b6eae;
}

.context-menu {
  position: absolute;
  z-index: 1000;
  background-color: #505050;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
.context-menu div {
  padding: 10px;
  cursor: pointer;
}
.context-menu div:hover {
  border-radius: 5px;
  background-color: #414141;
}
</style>