<script setup lang="ts">
import {useRouter} from 'vue-router'
const props = defineProps<{
    profileUsername : string
    profileLogin42: string
}>()

const router = useRouter();

async function invGame() {
   router.push("/game");
}
</script>

<template>
    <button type="button" class="btn btn-outline-success" @click="invGame">Invite Game</button>
</template>