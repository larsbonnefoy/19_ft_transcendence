<script setup lang="ts">
    import {ref} from 'vue'
    import { reactive } from 'vue'

    const counter = reactive({
        counter: 0
    })
    counter.counter++

    const message = ref('Hello World')
    message.value = 'changed'
</script>

<template>
    <h1> Make Me dynamic </h1>
    <h1> {{message}} </h1>
    <p>count is: {{ counter.counter }}</p>
</template>
