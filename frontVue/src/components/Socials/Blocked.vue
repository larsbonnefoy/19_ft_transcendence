<script setup lang="ts">
const props = defineProps<{
    login42 : string
}>()
</script>

<template>
    <div class="card-body textDisplay p-0 m-3">
        {{ props.login42 }}
    </div>   
</template>