<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import GameHistory from '@/components/GameHistory/GameHistory.vue';
import SocialsList from '@/components/Socials/SocialsList.vue';
import AchievmentsList from '@/components/Achievements/AchievementsList.vue';

const store = useUserStore();

await store.setStatus("online");

</script>

<template>
<div class="container-fluid">
  <div class="row">

    <div v-if="store.getUserName != undefined" class="col-4">
      <GameHistory
      :username-prop="store.getUserName"> 
      </GameHistory>
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
