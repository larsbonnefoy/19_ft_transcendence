<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref, onMounted, watch } from 'vue';
import ProfileCard from '@/components/ProfileDisplay/ProfileCard.vue';
import GameHistory from '@/components/Matches/GameHistory.vue';
import {useRoute, useRouter} from 'vue-router'
import axios from 'axios';
import {type UserInfo} from '../types'


const store = useUserStore();
const route = useRoute();
const router = useRouter();
let user: UserInfo;
const foundUser = ref(true);
console.log("route params");
console.log(route.params.username);

async function getUserInfo() {
    if (route.params.username != store.getUserName) {
        //get sur un profile qui existe pas envoie NULL est pas une erreur, a corriger (ou a mediter)
        try {
            const res = await axios.get(`http://localhost:3000/user/one:${route.params.username}`);
            if (!res.data) {
                foundUser.value = false;
            }

            /*
            Truc degeu pour display une image en attendant
            */
            else {
                user = res.data
                if (user) {
                    if (user.photo == "no photo yet") {
                        user.photo = "../../assets/placeholder_avatar.png"
                    }
                }
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
                <h1 style="text-align: center;"> Achievements </h1>
            </div>
        </div>
    </div>
</template>
<template v-else>
<h1 style="text-align: center"> User not found </h1>
</template>
</template>


