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
    const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/one:${props.usernameProp}`);
    console.log("User Info for achievment");
    console.log(res.data);
    const user: UserInfo = res.data;
    return user;
}
*/

//await getUserInfo();

const gameProgressAchievements: Achievement[] = [
{
        name: "Getting Started",
        imageUrl: "../../../assets/Achievements/1game.png",
        description: "Play one game.",
        progress: () => {
            const val = (props.userProp.win * 1 + props.userProp.loss * 1) / 1
            return val; /* Return only val in order to overflow 1 and not to be displayed in list */
        },
		current: props.userProp.win * 1 + props.userProp.loss * 1,
        max: 1,
    },
    {
        name: "Lifeguard",
        imageUrl: "../../../assets/Achievements/19.svg",
        description: "Play 19 Games",
        progress: () => {
            const val = (props.userProp.win * 1 + props.userProp.loss * 1) / 19;
            return val < 1 ? val : 1;
        },
		current: props.userProp.win * 1 + props.userProp.loss * 1,
        max: 19,
    },
    {
        name: "Welcome to the Jar",
        imageUrl: "../../../assets/Achievements/42_logo.svg",
        description: "Play 42 Games",
        progress: () => {
            const val = (props.userProp.win * 1 + props.userProp.loss * 1) / 42;
            return val < 1 ? val : 1;
        },
		current: props.userProp.win * 1 + props.userProp.loss * 1,
        max: 42,
    },   
]

const achievementList: Achievement[] = [
    {
        name: "Getting Started",
        imageUrl: "../../../assets/Achievements/1game.png",
        description: "Play one game.",
        progress: () => {
            const val = (props.userProp.win * 1 + props.userProp.loss * 1) / 1
            return val; /* Return only val in order to overflow 1 and not to be displayed in list */
        },
		current: props.userProp.win * 1 + props.userProp.loss * 1,
        max: 1,
    },
    {
        name: "Lifeguard",
        imageUrl: "../../../assets/Achievements/19.svg",
        description: "Play 19 Games",
        progress: () => {
            const val = (props.userProp.win * 1 + props.userProp.loss * 1);
            return val / 19;
        },
		current: props.userProp.win * 1 + props.userProp.loss * 1,
        max: 19,
    },
    {
        name: "Welcome to the Jar",
        imageUrl: "../../../assets/Achievements/42_logo.svg",
        description: "Play 42 Games",
        progress: () => {
            const val = (props.userProp.win * 1 + props.userProp.loss * 1);
            if (val <= 19) {
                return 2;
            }
            return val / 42 < 1 ? val / 42 : 1;
        },
		current: props.userProp.win * 1 + props.userProp.loss * 1,
        max: 42,
    },    
    {
        name: "Master",
        imageUrl: "../../../assets/Achievements/100games.png",
        description: "Win 100 Games",
        progress: () => {
            const val = (props.userProp.win * 1) / 100
            return val < 1 ? val : 1;
        },
		current: props.userProp.win * 1,
        max: 100,  
    },
    {
        name: "Incognito",
        imageUrl: "../../../assets/Achievements/incognito.png",
        description: "Change username",
        progress: () => {
			 return props.userProp.achievements & 1 ? 1 : 0;
		},
        current: -1,
		max: 1,
    },
    {
        name: "Make up Artist",
        imageUrl: "../../../assets/Achievements/makeup.png",
        description: "Change Profile Pic",
        progress: () => {
			return props.userProp.achievements & 2 ? 1 : 0;
		},
		current: -1,
        max: 1,
    },
    {
        name: "Flawless",
        imageUrl: "../../../assets/Achievements/flawless.png",
        description: "Win a game without conceding any points",
        progress: () => {
			return props.userProp.achievements & 4 ? 1 : 0;
		},
		current: -1,
        max: 1,
    },
    {
        name: "You and Me",
        imageUrl: "../../../assets/Achievements/handshake.png",
        description: "Make your first Friend",
        progress: () => {
			return props.userProp.achievements & 8 ? 1 : 0;
		},
		current: -1,
        max: 1,
    },
    {
        name: "Retro Gamer",
        imageUrl: "../../../assets/Achievements/retro.png",
        description: "Enter God Mode",
        progress: () => {
			return props.userProp.achievements & 16 ? 1 : 0;
		},
		current: -1,
        max: 1,
    },
    {
        name: "Shielded",
        imageUrl: "../../../assets/Achievements/shield.png",
        description: "Activate Double Authentification",
        progress: () => {
			return props.userProp.achievements & 32 ? 1 : 0;
		},
		current: -1,
        max: 1,
    },
]

</script>

<template>
    <h2 style="text-align: center; " class="m-5">Achievements </h2>
    <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 70vh;">
        <template v-for="(achievement, index) in gameProgressAchievements" :key="index">
            <div>
                <AchievementDisplay :achiev-id="index" :achievement-prop="achievement" :achiev-progress="achievement.progress()"> </AchievementDisplay>
            </div>
        </template>
        <template v-for="(achievement, index) in achievementList" :key="index">
            <div v-if="achievement.progress() <= 1">
                <AchievementDisplay :achiev-id="index" :achievement-prop="achievement" :achiev-progress="achievement.progress()"> </AchievementDisplay>
            </div>
        </template>
    </div>
</template>