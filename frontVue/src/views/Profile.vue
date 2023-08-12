<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { ref, onMounted } from 'vue';
import ProfileCard from '@/components/ProfileCard.vue';


/*
TODO
Get username form route, if it is the current logged user, dont need to call db and get info from store
*/
/*
const store = useUserStore();

const username = ref();

onMounted(() => {
    username.value = store.getUserName;
});

//Should set max lenght of username here

let submit = (() => {
    const ret = store.setName(username.value);
});
*/
</script>

<template>
<div class="container-fluid">
    <div class="row">
        <div class="col-4 p-0">
            <h1 style="text-align: center;"> Games </h1>
        </div>
        <div class="col-4 p-0">
            <ProfileCard> </ProfileCard>
        </div>
        <div class="col-4 p-0">
            <h1 style="text-align: center;"> Achievements </h1>
        </div>
    </div>
</div>
</template>


