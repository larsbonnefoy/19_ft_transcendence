<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import GameHistory from '@/components/Matches/GameHistory.vue';
import FriendsList from '@/components/Socials/FriendsListBis.vue';
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

    <div v-if="store.getUserName != undefined" class="col-5">
      <h2 style="text-align: center;"> Some More Content?? </h2>
      <p style="text-align: center;"> genre les succes </p>      
      <p style="text-align: center;"> et les games en live </p>
      <AchievmentsList :username-prop="store.getUserName"> </AchievmentsList>
    </div>

    <div class="col-3">
      <FriendsList></FriendsList>
    </div>
  </div>
</div>
</template>

<style>
</style>
