<template>
    <div class="container">
        <h1> {{page.title}} </h1>
        <p> {{page.content}} </p>
    </div>  
</template>

<script lang="ts">

export default {
    props: ['page'],
    }
</script>