<script setup lang="ts">
import axios from 'axios';
import MatchHistoryGame from './MatchHistoryGame.vue';
import {ref} from 'vue'
import {type match} from '../types'

const props = defineProps<{
    username : string
}>()

let matches: match[];
let login: string = "";

const succesReqHistory = ref(false);
/*
Verifier que si le user n'as pas de match (=> si le call a match history rate ou n'as pas de valeur)
Display message "Make friends and play game" ou un truc du genre
*/
try {
    const resHistory = await axios.get(`http://localhost:3000/match/history:${props.username}`)
    succesReqHistory.value = true;
    matches = resHistory.data;
    const resLogin = await axios.get(`http://localhost:3000/user/LogFromUser:${props.username}`)
    login = resLogin.data.login42;
}
catch (error : any) {
    console.log(error.message);
}

</script>

<template>
    <h2 class="title"> {{ props.username }}'s games </h2>
        <template v-if="succesReqHistory">
            <div class="border border-dark border-2 m-5">
                <ul v-for="(match, index) in matches" class="list-groupe m-0 p-0" :key="index">
                    <MatchHistoryGame
                    :username="props.username"
                    :login="login"
                    :match="match"
                    >
                    </MatchHistoryGame>
                </ul>
            </div>
        </template>
        <template v-else>
            <p style="text-align: center;"> No game played </p>
        </template>
</template>

<style>
.title {
    text-align: center;
    margin:5%
}
</style>

