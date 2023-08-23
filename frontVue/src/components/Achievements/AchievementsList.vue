<script setup lang="ts">
import AchievementDisplay from './Achievement.vue';
import axios from 'axios';
import { type Achievement, type UserInfo } from '@/types';
import { useUserStore } from '@/stores/user';

const props = defineProps<{
    userProp: UserInfo
}>()


//probablement devoir faire comme dans profile pr profile card
/*
async function getUserInfo(): Promise<UserInfo> {
    const res = await axios.get(`http://localhost:3000/user/one:${props.usernameProp}`);
    console.log("User Info for achievment");
    console.log(res.data);
    const user: UserInfo = res.data;
    return user;
}
*/

//await getUserInfo();

const achievementList: Achievement[] = [
    {
        name: "Getting Started",
        imageUrl: "../../../assets/Achievements/1game.png",
        description: "Play one game.",
        progress: () => {
            const val = (props.userProp.win*1 + props.userProp.loss*1) / 1
            return val < 1 ? val : 1;
        },
        max: 1
    },
    {
        name: "Pro player",
        imageUrl: "../../../assets/Achievements/5games.png",
        description: "Play 50 Games",
        progress: () => {
            const val = (props.userProp.win*1 + props.userProp.loss*1) / 50
            return val < 1 ? val : 1;
        },
        max: 50
    },    
    {
        name: "Master",
        imageUrl: "../../../assets/Achievements/100games.png",
        description: "Win 100 Games",
        progress: () => {
            const val = (props.userProp.win * 1) / 100
            return val < 1 ? val : 1;
        },
        max: 100    
    },
    {
        name: "Incognito",
        imageUrl: "../../../assets/Achievements/incognito.png",
        description: "Change username",
        progress: () => { return 0},
        max: 1
    },
    {
        name: "Make up Artist",
        imageUrl: "../../../assets/Achievements/makeup.png",
        description: "Change Profile Pic",
        progress: () => { return 0},
        max: 1
    },
    {
        name: "Flawless",
        imageUrl: "../../../assets/Achievements/flawless.png",
        description: "Win a game without conceding any points",
        progress: () => { return 0},
        max: 1
    },
    {
        name: "You and Me",
        imageUrl: "../../../assets/Achievements/handshake.png",
        description: "Make your first Friend",
        progress: () => { return 0},
        max: 1
    },
]

</script>

<template>
    <h2 style="text-align: center; " class="m-5">Achievements </h2>
    <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 80vh;">
        <template v-for="(achievement, index) in achievementList" :key="index">
           <AchievementDisplay :achiev-id="index" :achievement-prop="achievement" :achiev-progress="achievement.progress()"> </AchievementDisplay>
        </template>
    </div>
</template>