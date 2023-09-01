<script setup lang="ts">
import axios from "axios"
import { onMounted, ref } from "vue";
import Member from '@/components/Members/Member.vue';

const members:any = ref([]);

onMounted(async () => {
    try {
      const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/get`);
      members.value = res.data;
    }
    catch (error) {
        alert(error);
        console.log(error);
    }
});
</script>

<template>
<div class="container-fluid">
	<div class="row">

		<div class="col-3"></div>
		<div class="col-6">
			<div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 100vw; max-height: 60vh;">
				<div class="card-body">
					<h5 class="card-title" style="text-align: center;">Members</h5> 
					<template v-for="(member, index) in members" :key="index">
						<Member :member="member"></Member>
					</template>
				</div>
			</div>
		</div>
		<div class="col-3"></div>
	</div>
</div>
</template>

<style>
</style>
