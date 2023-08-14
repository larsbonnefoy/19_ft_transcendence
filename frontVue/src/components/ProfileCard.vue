<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref, computed } from 'vue';
import {type UserInfo} from '../types'
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps<{
    user : UserInfo
}>()

const store = useUserStore();

const username: any = ref(store.getUserName);

const activeUser = computed(() => {
    return props.user.login42 == store.getLogin42;
})

/*
Should set max lenght of username here
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
<div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center">
        <div class="col m-5">
            <div class="card m-5" style="border-radius: 15px;">
                <div class="card-body text-center">
                    <h4> {{ user.username }}</h4>
                    <p>{{ user.status}}</p>
                    <div class="mt-3 mb-4">
                    <img :src=user.photo />
                    </div>

                    <!-- Displays only if we are on the current Users page-->
                    <div v-if="activeUser" class="form-group row justify-content-center">
                        <label for="inputPassword" class="col-sm-5 col-form-label">Username: </label>
                        <div class="col-sm-5">
                        <input v-model="username" type="text" class="form-control mb-2" id="inputUsername" @keyup.enter="submit">
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between text-center mt-5 mb-2">
                        <div>
                            <p class="mb-2 h5"> {{ user.win }}</p>
                            <p class="text-muted mb-0">Wins</p>
                        </div>
                        <div class="px-3">
                            <p class="mb-2 h5">{{ user.loss }}</p>
                            <p class="text-muted mb-0">Losses</p>
                        </div>
                        <div>
                            <p class="mb-2 h5">{{ user.elo }}</p>
                            <p class="text-muted mb-0">Elo </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<style scoped>
img {
    width: 200px;
    height: auto;
    border-radius: 50%;
}
</style>