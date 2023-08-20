<script setup lang="ts">
const props = defineProps<{
    achievName : string
    achievId : number
    achievStatus: boolean
}>()
</script>

<template>
    <div class="card-body textDisplay p-0 m-3">
        {{ achievName }}
    </div>
</template>