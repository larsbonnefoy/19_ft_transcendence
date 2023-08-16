<script setup lang="ts">
import {ref} from 'vue'
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const router = useRouter();

const store = useUserStore();
const username: any = ref(store.getUserName);

/*
Should set max lenght of username here
+ display error if call to change failed
*/
let submit = (async () => {
    try {
        const ret = await store.setName(username.value);
        router.push({ name: 'profile', params: { username: username.value } })
    }
    catch (error:any) {
        console.error(error.message);
    }
})
</script>

<template>
    <div class="col-6 textDisplay"> 
        Change Username:
    </div>
    <div class="col-6">
        <input v-model="username" type="text" class="form-control mb-2" id="inputUsername" @keyup.enter="submit">
    </div>
</template>

<style scoped>
.textDisplay {
    text-align: left;
    margin: auto;
}
</style>