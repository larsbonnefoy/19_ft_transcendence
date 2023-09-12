<script setup lang="ts">
import {type match} from '../../types'
import {  computed } from 'vue';
import axios from 'axios';

const props = defineProps<{
    gameProp : match
    loginProp: string
    usernameProp: string
}>()

interface player {
    login42: string
    score: number
    elo: number
}

let opponent: player;
let user: player;
let opponentUsername: string;

async function setUserOpponent() {
    if (props.gameProp.player1 == props.loginProp) {
        user = { login42:props.gameProp.player1, score:props.gameProp.score1, elo:props.gameProp.elo1};
        opponent = { login42:props.gameProp.player2, score:props.gameProp.score2, elo:props.gameProp.elo2};
    }
    else {
        user = { login42:props.gameProp.player2, score:props.gameProp.score2, elo:props.gameProp.elo2};
        opponent = { login42:props.gameProp.player1, score:props.gameProp.score1, elo:props.gameProp.elo1};
    }
    try {
        let resUsername = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/UserFromLog:${opponent.login42}`)
        opponentUsername = resUsername.data.username;
    }
    catch (error : any) {
        opponentUsername = "deleted User"
        console.log(error.message + ": user has been deleted")
    }
}

const gameWon = computed(() => {
    return user.score > opponent.score;
})

await setUserOpponent();

</script>

<template>
    <div class="card-body textDisplay p-0 m-3">
        <div class="row">
            <div class="col-4 p-0"> <span class="eloDisplay mx-1">({{ user.elo}}) </span> {{ props.usernameProp }} </div>
            <!-- <div class="col-1 scoreDisplay"> {{ user.score }} </div> -->
            <div v-if="gameWon" class="col-4 p-0 gameWon">
                <span class="eloDisplay mx-1">{{ user.score}} </span> Won <span class="eloDisplay mx-1">{{ opponent.score}} </span>
            </div>
            <div v-else class="col-4 p-0 gameLost"> 
                <span class="eloDisplay mx-1">{{ user.score}} </span> Lost <span class="eloDisplay mx-1">{{ opponent.score}} </span>
            </div>
            <!-- <div class="col-1 scoreDisplay"> {{ opponent.score }} </div> -->
            <div class="col-4 p-0">
                <router-link
                    :to="{
                        name:'profile',
                        params: {
                            username: opponentUsername
                        }
                    }"
                class="linkDisplay"
                >
                {{ opponentUsername }} 
                </router-link>
                <span class="eloDisplay mx-1">({{ opponent.elo}}) </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.linkDisplay {
    text-decoration: none;
    color : white;
}

.linkDisplay:hover {
    color : grey;
}
.textDisplay {
    font-size: large;
    font-weight: bolder;
    text-align: center;
}

.eloDisplay {
    font-size: medium;
    font-weight: 400;
    color: grey;
}
.scoreDisplay {
    font-size: medium;
    font-weight: 400;
	color: white;
}

.gameWon {
    color: green;
}

.gameLost {
    color: red;
}
</style>