<script setup lang="ts">
import LeaderBoardUsr from './LeaderBoardUsr.vue';
import {type LeaderBoardUserInfo} from '@/types'
import axios from 'axios';
import {ref} from 'vue'

const users = ref();
const LeaderBoardExists = ref(false);
/*TODO function that gets only elo, username & picture, to avoid a query on whole db */
async function getLeaderBoard() {
    try {
        const res = await axios.get("http://localhost:3000/user/getLeaderBoard");
        users.value = res.data.slice().sort((a:LeaderBoardUserInfo, b:LeaderBoardUserInfo) => b.elo*1 - a.elo*1);
        LeaderBoardExists.value = true;
    }
    catch(error) {

    }
}

await getLeaderBoard();
</script>

<template>
<h2 style="text-align: center; " class="m-5"> LeaderBoard </h2>
<div  v-if="LeaderBoardExists" class="card text-white bg-dark overflow-auto shadow-lg" style="max-width: 70%; max-height: 70vh; margin:auto;">
        <template v-for="(user, index) in users" :key="index">
            <LeaderBoardUsr :user="user" :index="index"> </LeaderBoardUsr>
        </template>
</div>
</template>