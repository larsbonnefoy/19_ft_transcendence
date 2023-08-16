<script setup lang="ts">
import { watch, onMounted, ref, computed } from 'vue';
import { useUserStore } from '@/stores/user';
//import FriendsList from '@/components/Socials/FriendsList.vue';
import GameHistory from '@/components/Matches/GameHistory.vue';
import FriendsList from '@/components/Socials/FriendsListBis.vue';
const store = useUserStore();

const userExists = computed(() => {
    if (store.getUserName == undefined || store.getUserName == null) {
      return false;
    }
    return true;
})

</script>

<template>
<div class="container-fluid">
  <div class="row">

    <div v-if="store.getUserName != undefined" class="col-4">
      <GameHistory
      :username-prop="store.getUserName"> 
      </GameHistory>
    </div>

    <div class="col-5">
      <h2 style="text-align: center;"> Some More Content?? </h2>
      <p style="text-align: center;"> genre les succes </p>      
      <p style="text-align: center;"> et les games en live </p>
    </div>

    <div class="col-3">
      <FriendsList></FriendsList>
    </div>
  </div>
</div>
</template>

<style>
</style>
