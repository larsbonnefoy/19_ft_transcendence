<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { computed, ref } from 'vue';

const store = useUserStore();

const props = defineProps<{
    profileUsername : string
    profileLogin42: string
}>()

//const isBlocked = ref(store.getBlocked?.includes(props.profileLogin42));

const isBlocked = computed( () => {
    return (store.getBlocked?.includes(props.profileLogin42))
})


async function blockUser() {
    try {
        await store.blockUser(props.profileLogin42);
    }
    catch (error: any){
        console.log(error);
    }
}

async function unblockUser() {
    try {
        await store.unBlockUser(props.profileLogin42);
    }
    catch (error: any){
        console.log(error);
    }
}
</script>

<template>
    <template v-if="!isBlocked">
        <button type="button" class="btn btn-outline-danger" @click="blockUser">Block</button>
    </template>
    <template v-else> 
        <button type="button" class="btn btn-danger" @click="unblockUser">Unblock</button>
    </template>
</template>