<script setup lang="ts">

import { useUserStore } from '@/stores/user';
import { ref, onMounted } from 'vue';

const store = useUserStore();

const username = ref();

onMounted(() => {
    username.value = store.getUserName;
});

/*
Should set max lenght of username here
*/
let submit = (() => {
    const ret = store.setName(username.value);
})
</script>

<template>
<div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center">
        <div class="col m-5">
            <div class="card m-5" style="border-radius: 15px;">
                <div class="card-body text-center">
                    <h4> {{ store.getUserName }}</h4>
                    <p>{{ store.getStatus }}</p>
                    <div class="mt-3 mb-4">
                    <img :src=store.getImg />
                    </div>
                    <div class="form-group row justify-content-center">
                        <label for="inputPassword" class="col-sm-5 col-form-label">Username: </label>
                        <div class="col-sm-5">
                        <input v-model="username" type="text" class="form-control mb-2" id="inputUsername" @keyup.enter="submit">
                        </div>
                    </div>
                    <div class="d-flex justify-content-between text-center mt-5 mb-2">
                        <div>
                            <p class="mb-2 h5"> 0</p>
                            <p class="text-muted mb-0">Wins</p>
                        </div>
                        <div class="px-3">
                            <p class="mb-2 h5">0</p>
                            <p class="text-muted mb-0">Losses</p>
                        </div>
                        <div>
                            <p class="mb-2 h5">0</p>
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