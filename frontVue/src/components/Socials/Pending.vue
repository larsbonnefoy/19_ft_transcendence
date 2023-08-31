<script setup lang="ts">
import { type UserInfo } from '@/types';
import AddPendingRemoveButton from '../ProfileDisplay/AddPendingRemoveButton.vue';
import axios from 'axios';
import Status from '../ProfileDisplay/Status.vue';
import { useUserStore } from '@/stores/user';
import { onUnmounted } from 'vue';

const props = defineProps<{
    login42 : string
}>()

const store = useUserStore();
let pendingUser: UserInfo;
let pendingUserName : string = "";

async function getPending() {
    try {
        const resUsrName = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/UserFromLog:${props.login42}`)
        pendingUserName = resUsrName.data.username;
		if (pendingUser)
			URL.revokeObjectURL(pendingUser.photo);
        const resUsr = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/one:${pendingUserName}`)
        pendingUser = resUsr.data;
        if (pendingUser)
			pendingUser.photo = await store.getAvatar(pendingUser.photo);
    }
    catch (error) {
        console.error(error);
    }
}

await getPending();

onUnmounted(async () => {
    URL.revokeObjectURL(pendingUser.photo);
});
</script>

<template>
    <div class="card-body textDisplay p-0 m-3">
        <div class="row">
            
            <div class="col-6">
                <div class="row"> 
					<div class="col-1 p-0 buttonStyle">
						<Status :status="pendingUser.status"></Status>
					</div>
                    <div class="col-4"> 
                        <router-link 
                        :to="{
                            name:'profile',
                            params: {
                                username: pendingUserName
                            }
                        }"
                        >
                        <img class="profileImg m-1" :src="pendingUser.photo">
                        </router-link>
                    </div>
                    <div class="col-7">
                        <p class="m-0"> {{ pendingUser.username }} </p>
                        <p class="m-0" style="color: grey;"> elo : {{ Math.ceil(pendingUser.elo) }} </p>
                    </div> 
                </div>
            </div>

        <div class="col-6 p-0 buttonStyle">
            <AddPendingRemoveButton :pending-user="pendingUser"></AddPendingRemoveButton>
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