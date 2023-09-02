<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import SocialsList from '@/components/Socials/SocialsList.vue';
import AchievmentsList from '@/components/Achievements/AchievementsList.vue';
import LeaderBoard from '@/components/Game/LeaderBoard.vue';
import { onMounted, onUnmounted, ref } from 'vue';
import { socket } from '@/socket';

const achievKey = ref(0); //Each time we need to reload the component the key is changed

socket.on('achievement', async (message: string) => {
    await store.fetchUser();
    achievKey.value += 1;
});

const store = useUserStore();
let windowWidth = ref(window.innerWidth);

function handleResize() {
	windowWidth.value = window.innerWidth;
}

onMounted(async () => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(async () => {
    window.removeEventListener('resize', handleResize);
});

</script>

<template>
<div class="container-fluid">
	<!-- {{ windowWidth }} -->
  <div v-if="windowWidth > 1400" class="row">
    <div class="col-4"> 				
				<LeaderBoard> </LeaderBoard>
 		</div>
    <div v-if="store.getUser != null" class="col-4">
      <AchievmentsList :key="achievKey" :user-prop="store.getUser"> </AchievmentsList>
    </div>
    <div class="col-4">
      <SocialsList></SocialsList>
    </div>
  </div>

  <div v-else-if="windowWidth > 800" class="row">
    <div class="col-6"> 				
		<LeaderBoard> </LeaderBoard>
		<SocialsList></SocialsList>
	</div>
    <div v-if="store.getUser != null" class="col-6">
      <AchievmentsList :key="achievKey" :user-prop="store.getUser"> </AchievmentsList>
    </div>
  </div>
  
  <div v-else class="row">			
		<LeaderBoard> </LeaderBoard>
		<div v-if="store.getUser != null">
			<AchievmentsList :key="achievKey" :user-prop="store.getUser"> </AchievmentsList>
		</div>
		<SocialsList></SocialsList>
  </div>
</div>
</template>

<style>
</style>
