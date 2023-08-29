<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import SocialsList from '@/components/Socials/SocialsList.vue';
import AchievmentsList from '@/components/Achievements/AchievementsList.vue';
import LeaderBoard from '@/components/Game/LeaderBoard.vue';

const store = useUserStore();

</script>

<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-4"> 				
				<LeaderBoard> </LeaderBoard>
 		</div>
    <div v-if="store.getUser != null" class="col-4">
      <AchievmentsList :user-prop="store.getUser"> </AchievmentsList>
    </div>
    <div class="col-4">
      <SocialsList></SocialsList>
    </div>
  </div>
</div>
</template>

<style>
</style>
