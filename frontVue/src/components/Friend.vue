<script setup lang="ts">
import axios from 'axios';
import { type UserInfo } from '@/types';
import {ref} from 'vue';

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
    <div class="container p-0 border border-dark border-1">
        <div class="card">
            <div class="card-body p-1">
                <div class="d-flex text-black">
                    <div class="flex-shrink-0">
                        <router-link 
                            :to="{
                                name:'profile',
                                params: {
                                    username: FriendUsername
                                }
                            }"
                        >
                        <img class="profileImg" :src="friend.photo">
                        </router-link>
                    </div>
                    <div class="flex-grow-1 ms-3">
                        <div class="d-flex justify-content-start rounded-3 p-2 m-1 textDisplay"
                            style="background-color: #efefef;">
                            <div>
                                <p class="small text-muted m-1">{{ friend.username }}: {{ friend.status }}</p>
                            </div>
                            <div class="px-3">
                                <p class="small text-muted m-1">elo: {{ friend.elo }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.textDisplay {
    font-size: small;
}
.profileImg {
    width: 50px;
    height: 50px;
    border-radius: 3px;
}
</style>
