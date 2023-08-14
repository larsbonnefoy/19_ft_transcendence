<script setup lang="ts">
import axios from 'axios';
import { type UserInfo } from '@/types';
import {ref} from 'vue';
import GameButton from '../ProfileDisplay/GameButton.vue';
import MessageButton from '../ProfileDisplay/MessageButton.vue';

const props = defineProps<{
    login42 : string
}>()

let FriendUsername: string="";
let friend: UserInfo;
/*
    Atm on recup toutes les infos du user (genre ses amis aussi), ca risque de faire bcp de requests quand y aura bcp d'amis
    Il faudrait: username, login, status, photo, elo;
*/
try {
    const resUsrName = await axios.get(`http://localhost:3000/user/UserFromLog:${props.login42}`)
    FriendUsername = resUsrName.data.username;
    const resUsr = await axios.get(`http://localhost:3000/user/one:${FriendUsername}`)
    friend = resUsr.data;
    if (friend.photo == "no photo yet") {
        friend.photo = "../../assets/placeholder_avatar.png"
    }
}
catch (error) {
    console.error(error);
}
</script>

<template>
    <div class="container p-0">
        <div class="card">
            <div class="card-body p-0">
                <div class="d-flex text-black">
                    
                    <router-link 
                        :to="{
                            name:'profile',
                            params: {
                                username: FriendUsername
                            }
                        }"
                        class=""
                    >
                    <img class="profileImg m-1" :src="friend.photo">
                    </router-link>

                    <div class="flex-grow-1 ms-1 friendsDisplay">
                        <div>
                            <p class="small text-muted m-1">{{ friend.username }}: {{ friend.status }}</p>
                        </div>
                        <div class="">
                            <p class="small text-muted m-1">elo: {{ friend.elo }}</p>
                        </div>
                    </div>
                    <GameButton :profile-username="FriendUsername" :profile-login42="login42" class="btn-sm m-1 small"> </GameButton>
                    <MessageButton :profile-username="FriendUsername" :profile-login42="login42" class="btn-sm m-1 small"></MessageButton>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profileImg {
    width: 45px;
    height: 45px;
    border-radius: 3px;
}
.friendsDisplay {
    font-size: small;
    text-align: left;
}
</style>
