<script setup lang="ts">
import AchievementDisplay from './Achievement.vue';
import { type Achievement, type UserInfo } from '@/types';
import { ref } from 'vue';

const props = defineProps<{
    userProp: UserInfo
}>()

const displayAll = ref(false);

function toggleAchDisplay() {
    displayAll.value = !displayAll.value
}

/* In normal mode: display only first value that is not =1 or last value if array */
const gameProgressAchievements: Achievement[] = [
{
        name: "Getting Started",
        imageUrl: "../../../assets/Achievements/1game.png",
        description: "Play one game.",
        progress: () => {
            const val = (props.userProp.win * 1 + props.userProp.loss * 1) / 1
            return val < 1 ? val : 1; /* Return only val in order to overflow 1 and not to be displayed in list */
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
            <div v-if="displayAll">
                <AchievementDisplay @toggle-ach-display="toggleAchDisplay" :extendable=true :achiev-id="index" :achievement-prop="achievement" :achiev-progress="achievement.progress()"> </AchievementDisplay>
            </div>
            <div v-else>
                <template v-if="achievement.progress() < 1">
                    <AchievementDisplay @toggle-ach-display="toggleAchDisplay" :extendable=true :achiev-id="index" :achievement-prop="achievement" :achiev-progress="achievement.progress()"> </AchievementDisplay>
                </template>
            </div>

        </template>
        <template v-for="(achievement, index) in achievementList" :key="index">
                <AchievementDisplay :extendable=false :achiev-id="index" :achievement-prop="achievement" :achiev-progress="achievement.progress()"> </AchievementDisplay>
        </template>
    </div>
</template>