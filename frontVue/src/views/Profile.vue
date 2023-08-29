<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref, onMounted, watch, onUnmounted } from 'vue';
import ProfileCard from '@/components/ProfileDisplay/ProfileCard.vue';
import GameHistory from '@/components/GameHistory/GameHistory.vue';
import AchievementsList from '@/components/Achievements/AchievementsList.vue';
import {useRoute, useRouter} from 'vue-router'
import axios from 'axios';
import {type UserInfo} from '../types'


const store = useUserStore();
const route = useRoute();
let user: UserInfo;
const foundUser = ref(true);

async function getUserInfo() {
    if (route.params.username != store.getUserName) {
        //get sur un profile qui existe pas envoie NULL est pas une erreur, a corriger (ou a mediter)
        try {
			if (user) {
			    URL.revokeObjectURL(user.photo); //to release memory
            }
            const res = await axios.get(`http://localhost:3000/user/one:${route.params.username}`);
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

await getUserInfo();

watch(() => route.params.username, getUserInfo);

onUnmounted(async () => {
    URL.revokeObjectURL(user.photo);
});
</script>

<template>
<template v-if="foundUser" class="col-2">
    <div class="container-fluid">
        <div class="row">
            <div class="col-4">
                <GameHistory 
                    :username-prop="user.username"
                >
                </GameHistory>
            </div>
            <div class="col-4 p-0">
                <ProfileCard :user="user"> </ProfileCard>
            </div>
            <div class="col-4 p-0">
                <AchievementsList :user-prop="user"> </AchievementsList>
            </div>
        </div>
    </div>
</template>
<template v-else>
<h1 style="text-align: center"> User not found </h1>
</template>
</template>


