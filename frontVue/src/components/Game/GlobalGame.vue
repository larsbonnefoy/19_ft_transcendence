<script setup lang="ts">
import {type match} from '../../types'
import { computed } from 'vue';
import axios from 'axios';

const props = defineProps<{
    gameProp : match
}>()

interface player {
    login42: string
    username: string
    score: number
    elo: number
}

let player0: player;
let player1: player;
const gMode: string = getMode();

async function setUserOpponent() {
    player0 = { login42:props.gameProp.player1, username:"deleted User", score:props.gameProp.score1, elo:props.gameProp.elo1};
    player1 = { login42:props.gameProp.player2, username:"deleted User", score:props.gameProp.score2, elo:props.gameProp.elo2};
    try {
        let resUsername = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/UserFromLog:${player0.login42}`)
        player0.username = resUsername.data.username;
    }
    catch (error : any) {
        console.log(error.message + ": user has been deleted")
    }
    try {
        let resUsername = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/UserFromLog:${player1.login42}`)
        player1.username = resUsername.data.username;
    }
    catch (error : any) {
        console.log(error.message + ": user has been deleted")
    }
}

function getMode(): string {
    switch (+props.gameProp.gMode) {
        case (0):
            return "Classic";
        case (1):
            return "Fun";
        case(2):
            return "Hard";
        default:
            return "";
    }
}

const player0Won = computed(() => {
    return player0.score > player1.score;
})

await setUserOpponent();

</script>

<template>
    <div class="card-body textDisplay p-0 m-3">
        <div class="row">
        <div class="col-2"><span class="">{{ gMode }}</span></div>
        <div class="col-4 p-0"> 
            <span class="eloDisplay mx-1">({{ player0.elo}}) </span> 
            <router-link
                    :to="{
                        name:'profile',
                        params: {
                            username: player0.username
                        }
                    }"
                class="linkDisplay"
                >
                {{ player0.username }} 
                </router-link>
           </div>
        <!-- <div class="col-1 scoreDisplay"> {{ user.score }} </div> -->
        <div v-if="player0Won" class="col-2 p-0">
			<span class="eloDisplay gameWon mx-1">{{ player0.score}} </span> <span class="eloDisplay gameLost mx-1">{{ player1.score}} </span>
		</div>
        <div v-else class="col-2 p-0"> 
			<span class="eloDisplay gameLost mx-1">{{ player0.score}} </span> <span class="eloDisplay gameWon mx-1">{{ player1.score}} </span>
		</div>
        <div class="col-4 p-0">
                <router-link
                    :to="{
                        name:'profile',
                        params: {
                            username: player1.username
                        }
                    }"
                class="linkDisplay"
                >
                {{ player1.username }} 
                </router-link>
            <span class="eloDisplay mx-1">({{ player1.elo}}) </span>
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

.grey {
    color: grey;
}

.gameWon {
    color: green;
}

.gameLost {
    color: red;
}
</style>