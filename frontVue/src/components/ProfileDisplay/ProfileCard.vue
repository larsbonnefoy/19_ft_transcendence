<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref, computed, onUnmounted } from 'vue';
import {type UserInfo} from '../../types'
import AddPendingRemoveButton from './AddPendingRemoveButton.vue';
import MessageButton from './MessageButton.vue';
import GameButton from './GameButton.vue';
import BlockButton from './BlockButton.vue';
import DoubleAuthButton from './DoubleAuthButton.vue';
import DisplayLogin from './DisplayLogin.vue';
import ChangeUsername from './ChangeUsername.vue';
import UploadAvatar from './UploadAvatar.vue'
import Status from './Status.vue';
import axios from 'axios';

const props = defineProps<{
    user : UserInfo
}>()

const store = useUserStore();

const activeUser = computed(() => {
    return props.user.login42 == store.getLogin42;
})

const modProfile = ref(false);

function toggleModProfile() {
    modProfile.value = !modProfile.value;
}

// async function resetAchievements() {
// 	await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/resetAchievements`, { headers: {token: localStorage.getItem('jwt_token')} });
// }

if (props.user.photo === "no photo yet") {
    props.user.photo = "/assets/placeholder_avatar.png"
}

/*
Should set max lenght of username here
*/
</script>

<template>
<div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center">
        <div class="col m-5">
            <div class="card m-5" style="border-radius: 15px;">
                <div class="card-body text-center"> <!-- White Profile card  style="min-height: 60vh; max-height: 70vh;"-->
                    <div v-if="!modProfile"> 
                        <h4> {{ user.username }}</h4>
                        <p style="color: grey;" v-if="user.displayLogin">Login42: {{ user.login42 }} </p>
                        <Status :status="user.status"></Status> <!-- Meme pb que avec les games, ne se refresh pas correctement-->
                        <div class="mt-3 mb-4">
                        <img class="ProfilePic" :src=user.photo />
                        </div>

                        <!-- Displays only if we are on the current Users page-->
                        <div v-if="!activeUser" class=row>
                            <div class="my-2">
                                <AddPendingRemoveButton :pending-user="user"></AddPendingRemoveButton>
                            </div>
                            <div class="btn-group text-center my-2">
                            <GameButton :profile-username="user.username" :profile-login42="user.login42"> </GameButton>
                            <MessageButton :profile-username="user.username" :profile-login42="user.login42"></MessageButton>
                            <BlockButton :profile-username="user.username" :profile-login42="user.login42"></BlockButton>
                            </div>
                        </div>
                        
                        <div class="d-flex justify-content-between text-center m-4">
                            <div>
                                <p class="mb-2 h5"> {{ user.win }}</p>
                                <p class="text-muted mb-0">Wins</p>
                            </div>
                            <div class="px-3">
                                <p class="mb-2 h5">{{ user.loss }}</p>
                                <p class="text-muted mb-0">Losses</p>
                            </div>
                            <div>
                                <p class="mb-2 h5">{{ Math.ceil(user.elo) }}</p>
                                <p class="text-muted mb-0">Elo </p>
                            </div>
                        </div>
                        <img v-if="activeUser" class="ModProfilePic" src="/assets/pen.png" @click.prevent="toggleModProfile" > <!-- Btn to toggle profile only displays if its current user-->
                    </div>
                    <div v-if="modProfile" class="form-group row justify-content-left">
                        <h4> {{ user.username }}</h4>
                        <ChangeUsername class="my-3"> </ChangeUsername>
                        <UploadAvatar class="my-3"></UploadAvatar>
                        <DisplayLogin class="my-3"></DisplayLogin>
                        <DoubleAuthButton></DoubleAuthButton>
                        <div v-if="activeUser" > 
                            <img class="ModProfilePic m-5" src="/assets/left-arrow.png" @click.prevent="toggleModProfile">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<style>
.ProfilePic {
    height: fit-content;
    width: 15vw;
    max-height: 30vh;
    border-radius: 10%;
}

.ModProfilePic {
    width: 30px;
    height: auto;
    opacity: 0.7;
}

.ModProfilePic:hover {
    opacity: 1;
}
</style>