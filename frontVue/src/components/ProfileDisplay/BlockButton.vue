<script setup lang="ts">

const props = defineProps<{
    profileUsername : string
    profileLogin42: string
}>()


async function blockUser() {
    console.log("Block function code goes here")
}
</script>

<template>
    <button type="button" class="btn btn-outline-danger" @click="blockUser">Block</button>
</template>