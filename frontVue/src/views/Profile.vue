<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref, onMounted, watch, onUnmounted, computed } from 'vue';
import ProfileCard from '@/components/ProfileDisplay/ProfileCard.vue';
import GameHistory from '@/components/GameHistory/GameHistory.vue';
import AchievementsList from '@/components/Achievements/AchievementsList.vue';
import Friend from '../components/Socials/Friend.vue';
import FriendWrapper from '@/components/ProfileDisplay/FriendWrapper.vue';
import {useRoute, useRouter} from 'vue-router'
import axios from 'axios';
import {type UserInfo} from '../types'
import { socket } from '@/socket';


const store = useUserStore();
const route = useRoute();
let user: UserInfo;
const foundUser = ref(true);
let windowWidth = ref(window.innerWidth);
const achievKey = ref(0); //Each time we need to reload the component the key is changed
const displayAch = ref(true);

async function getUserInfo() {
    if (route.params.username != store.getUserName) {
        //get sur un profile qui existe pas envoie NULL est pas une erreur, a corriger (ou a mediter)
        try {
			if (user) {
			    URL.revokeObjectURL(user.photo); //to release memory
            }
            const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/one:${route.params.username}`);
            if (!res.data) {
                foundUser.value = false;
            }
            else {
                console.log(res.data);
                user = res.data
                if (user)
					user.photo = await store.getAvatar(user.photo);
            }
        }
        catch (error: any) {
            console.log(error.message)
        }
    }
    else {
        if (store.getUser) {
            user = store.getUser
        }
    }
}

function toggleAch() {
    displayAch.value = !displayAch.value;
}

watch(
    () => route.params.username, 
    async newId => {
    foundUser.value = false;
    await getUserInfo();
    foundUser.value = true;
})


function handleResize() {
	windowWidth.value = window.innerWidth;
}

socket.on('achievementUpdate', async () => {
	// console.log("got ach update");
    await store.fetchUser();
    await getUserInfo();
    achievKey.value += 1;
});

await getUserInfo();

onMounted(async () => {
    window.addEventListener('resize', handleResize);
});

onUnmounted(async () => {
    if (user) {
        URL.revokeObjectURL(user.photo);
    }
    window.removeEventListener('resize', handleResize);
    socket.off('achievementUpdate');
});
</script>

<template>
<template v-if="foundUser">
    <div class="container-fluid">
        <div v-if="windowWidth > 1400" class="row">
            <div class="col-4">
                <GameHistory :username-prop="user.username"></GameHistory>
            </div>
            <div class="col-4 p-0">
                <ProfileCard :user="user"> </ProfileCard>
            </div>
            <div class="col-4 p-0">
                <template v-if="displayAch">
                    <AchievementsList @toggle-friend-display="toggleAch" :key="achievKey" :user-prop="user"> </AchievementsList>
                </template>
                <template v-else>
                    <FriendWrapper  @toggle-friend-display="toggleAch" :use-friend-list=user.friends> </FriendWrapper>
                </template>
            </div>
        </div>

        <div v-else-if="windowWidth > 800" class="row">
            <div class="col-6">
                <GameHistory :username-prop="user.username"></GameHistory>
				<template v-if="displayAch">
                    <AchievementsList @toggle-friend-display="toggleAch" :key="achievKey" :user-prop="user"> </AchievementsList>
                </template>
                <template v-else>
                    <FriendWrapper  @toggle-friend-display="toggleAch" :use-friend-list=user.friends> </FriendWrapper>
                </template>
            </div>
            <div class="col-6 p-0">
                <ProfileCard :user="user"> </ProfileCard>
            </div>
        </div>
        <div v-else class="row">
			<div class="row">
				<ProfileCard :user="user"> </ProfileCard>
			</div>
			<div class="row">
				<div class="col-12"> <!-- seems stupid but it works -->
					<GameHistory :username-prop="user.username"></GameHistory>
				</div>
			</div>
			<div class="row">
				<div class="col-12">
					<template v-if="displayAch">
                        <AchievementsList @toggle-friend-display="toggleAch" :key="achievKey" :user-prop="user"> </AchievementsList>
                    </template>
                    <template v-else>
                        <FriendWrapper  @toggle-friend-display="toggleAch" :use-friend-list=user.friends> </FriendWrapper>
                    </template>
				</div>
			</div>
        </div>
    </div>
</template>
    <template v-else>
        <h1 style="text-align: center"> User not found </h1>
    </template>
</template>


