<script setup lang="ts">
import axios from 'axios';
import { type UserInfo } from '@/types';
import { useUserStore } from '@/stores/user';
import type _default from 'pinia-plugin-persistedstate';
import { ref } from 'vue';

const props = defineProps<{
    login42: string;
}>()

const store = useUserStore();
const foundUser = ref(false);
let user: UserInfo;
let opponentUsername: string;

async function getUserInfo() {
    if (props.login42 != store.getLogin42) {
        try {
            const resUsrName = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/UserFromLog:${props.login42}`)
            opponentUsername = resUsrName.data.username;
            const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/one:${opponentUsername}`);
            if (!res.data) {
                foundUser.value = false;
            }
            else {
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

</script>

<template>
    <div class="card text-white bg-dark overflow-auto shadow-lg">
        <div class="card-body">
            <div class="row">
                <router-link 
                    :to="{
                        name:'profile',
                        params: {
                            username: user.username
                        }
                    }"
                >
                <img class="profileImg m-1" :src="user.photo">
                </router-link>
            </div>
            <div class="row textDisplay m-1">
                <template v-if="user.username == store.getUserName">
                    <p style="color: darkgreen;"> {{ user.username }} </p>
                </template>
                <template v-else>
                    <p style="color: darkred;"> {{ user.username }} </p>
                </template>
                <p style="color: grey;"> elo : {{ Math.ceil(user.elo) }} </p>
            </div> 
            <div v-if="user.username != store.getUserName" class="row p-0 text-center">
            </div>
        </div>
    </div>
</template>

<style scoped>
img {
    height: fit-content;
    width: 15vw;
    border-radius: 10%;
}

.textDisplay {
    font-size: 1.5vw;
    text-align: center;
}
</style>