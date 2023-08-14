<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import FriendsList from '@/components/FriendsList.vue';
import MatchHistory from '@/components/MatchHistory.vue';

const store = useUserStore();

</script>

<template>
<div class="container-fluid">
  <div class="row">
    <div v-if="store.getUserName != undefined" class="col-3">
      <MatchHistory 
      :username="store.getUserName"
      >
      </MatchHistory>
    </div>
    <div class="col-7">
      <h2 style="text-align: center;"> Some More Content?? </h2>
      <p style="text-align: center;"> genre les succes </p>
    </div>
    <div class="col-2 p-0">
        <FriendsList></FriendsList>
    </div>
  </div>
</div>
</template>

<style>
</style>
