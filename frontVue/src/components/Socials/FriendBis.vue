<script setup lang="ts">
import { type UserInfo } from '@/types';
import {ref} from 'vue'
import axios from 'axios';
import Friend from './Friend.vue';
import GameButton from '../ProfileDisplay/GameButton.vue';
import MessageButton from '../ProfileDisplay/MessageButton.vue';
import Status from '../ProfileDisplay/Status.vue';

const props = defineProps<{
    login42 : string
}>()

let FriendUsername: string="";
let friend: UserInfo;

async function getFriend() {
    try {
        const resUsrName = await axios.get(`http://localhost:3000/user/UserFromLog:${props.login42}`)
        FriendUsername = resUsrName.data.username;
        const resUsr = await axios.get(`http://localhost:3000/user/one:${FriendUsername}`)
        friend = resUsr.data;
        if (friend.photo == "no photo yet") {
            friend.photo = "../../assets/placeholder_avatar_white.png"
        }
        console.log(friend.photo);
    }
    catch (error) {
        console.error(error);
    }
}

await getFriend();
</script>

<template>
    <div class="card-body textDisplay p-0 m-3">
        <div class="row">
        <div class="col-1 p-0 buttonStyle">
            <Status status="online"> </Status>
        </div>
        <div class="col-5"> 
            <router-link 
                :to="{
                    name:'profile',
                    params: {
                        username: FriendUsername
                    }
                }"
                >
                <img class="profileImg m-1" :src="friend.photo">
            </router-link>
            {{ login42 }}
        </div>
        <!-- Add a getter to get status-->

        <div class="col-3 p-0 buttonStyle">
            <GameButton :profile-username="FriendUsername" :profile-login42="login42" class="btn-sm m-1 small"> </GameButton>
        </div>
        <div class="col-3 p-0 buttonStyle">
            <MessageButton :profile-username="FriendUsername" :profile-login42="login42" class="btn-sm m-1 small"></MessageButton>
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

.buttonStyle {
    margin: auto;
    text-align: center;
}
</style>