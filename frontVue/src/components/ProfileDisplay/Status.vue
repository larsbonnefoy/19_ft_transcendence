<script setup lang="ts">
const props = defineProps<{
    status : string
}>()
</script>

<template>
    <div>
    <img class="statusImg" src="../../../assets/presence_available.png">
    </div>
</template>

<style>
.statusImg{
    height: 15px;
    width: auto;
}
</style>