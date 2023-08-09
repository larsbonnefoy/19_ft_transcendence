<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref, onMounted } from 'vue';

const store = useUserStore();

const username = ref();

onMounted(() => {
    username.value = store.getUserName;
});

let submit = (() => {
    const ret = store.setName(username.value);
    console.log(ret);
});

</script>

<template>
    <section class="vh-100">
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-md-12 col-xl-4">
                <div class="card" style="border-radius: 15px;">
                    <div class="card-body text-center">
                        <h4> {{ store.getUserName }}</h4>
                        <p>{{ store.getStatus }}</p>
                        <div class="mt-3 mb-4">
                        <img :src=store.getImg
                            class="rounded-circle img-fluid" style="width: 200px;" />
                        </div>
                        <div class="form-group row justify-content-center">
                            <label for="inputPassword" class="col-sm-5 col-form-label">Username: </label>
                            <div class="col-sm-5">
                            <input v-model="username" type="text" class="form-control mb-2" id="inputUsername" @keyup.enter="submit">
                            </div>
                        </div>
                        <div class="d-flex justify-content-between text-center mt-5 mb-2">
                            <div>
                                <p class="mb-2 h5">{{ store.$state.user?.win }}</p>
                                <p class="text-muted mb-0">Wins</p>
                            </div>
                            <div class="px-3">
                                <p class="mb-2 h5">{{ store.$state.user?.loss }}</p>
                                <p class="text-muted mb-0">Losses</p>
                            </div>
                            <div>
                                <p class="mb-2 h5">{{ store.$state.user?.elo }}</p>
                                <p class="text-muted mb-0">Elo </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
</template>

<style>
</style>
