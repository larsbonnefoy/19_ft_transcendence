<script setup lang="ts">
import { type UserInfo } from '@/types';
import {onUnmounted, ref} from 'vue'
import axios from 'axios';
import GameButton from '../ProfileDisplay/GameButton.vue';
import MessageButton from '../ProfileDisplay/MessageButton.vue';
import Status from '../ProfileDisplay/Status.vue';
import { useUserStore } from '@/stores/user';

const props = defineProps<{
    login42 : string
}>()

const store = useUserStore();
let FriendUsername: string="";
let friend: UserInfo;
//get et Set status aussi
async function getFriend() {
    try {
        const resUsrName = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/UserFromLog:${props.login42}`);
        FriendUsername = resUsrName.data.username;
		if (friend)
			URL.revokeObjectURL(friend.photo); //to release memory
        const resUsr = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/one:${FriendUsername}`);
        friend = resUsr.data;
        if (friend)
			friend.photo = await store.getAvatar(friend.photo);
    }
    catch (error) {
        console.error(error);
    }
}

await getFriend();

onUnmounted(async () => {
    URL.revokeObjectURL(friend.photo);
});
</script>

<template>
    <div class="card-body p-0 m-3">
        <div class="row">
        
        	<div class="col-6">
        		<div class="row"> 
            		<div class="col-1 p-0 buttonStyle">
						<Status :status="friend.status"></Status>
					</div>
					<div class="col-4"> 
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
                	</div>
                	<div class="col-7">
                    	<p class="m-0"> {{ friend.username }} </p>
                    	<p class="m-0" style="color: grey;"> elo : {{ Math.ceil(friend.elo) }} </p>
                	</div> 
            	</div>
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
    height: fit-content;
    width: 3vw;
    border-radius: 10%;
}
.buttonStyle {
    margin: auto;
    text-align: center;
}
</style>