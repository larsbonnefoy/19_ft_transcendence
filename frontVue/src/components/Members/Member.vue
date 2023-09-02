<script setup lang="ts">
import { type MemberInfo } from '@/types';
import { useUserStore } from '@/stores/user';
import { onUnmounted, onMounted } from 'vue';
import Status from '../ProfileDisplay/Status.vue';

const props = defineProps<{
    member : MemberInfo
}>()

const store = useUserStore();

onMounted(async () => {
	props.member.photo = await store.getAvatar(props.member.photo);
});

onUnmounted(async () => {
    URL.revokeObjectURL(props.member.photo);
});
</script>

<template>
<div class="card-body textDisplay p-0 m-3">
    <div class="row"> 
    	<div class="col-1 p-0 buttonStyle">
			<Status :status="props.member.status"></Status>
		</div>
		<div class="col-4"> 
			<router-link 
               	:to="{
        	       	name:'profile',
                   	params: {
                       	username: props.member.username
                   	}
               	}"
            >
            	<img class="profileImg m-1" :src="props.member.photo">
            </router-link>
        </div>
        <div class="col-5">
           	{{ props.member.username }}
        </div> 
		<div class="col-2">
			<p style="color: grey;"> elo : {{ Math.ceil(props.member.elo) }} </p>
		</div>
	</div>
</div>
</template>

<style scoped>
.profileImg {
	max-height:100%;
	width:auto;
    /* width: 45px; */
    /* height: 45px; */
    border-radius: 3px;
}
.buttonStyle {
    margin: auto;
    text-align: center;
}
</style>
