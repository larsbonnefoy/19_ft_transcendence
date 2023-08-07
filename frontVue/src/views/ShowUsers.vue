<script setup lang="ts">
import { ref } from 'vue';
import UserList from '@/components/UserList.vue'
import axios from "axios"

const data = ref([]);
</script>

<template>
    <div class="bg-dark">
    <h1> Display Users </h1>
    <Suspense>
        <UserList></UserList>
    </Suspense>
</div>
</template>

<style>
</style>
