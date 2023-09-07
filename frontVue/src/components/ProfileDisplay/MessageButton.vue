<script setup lang="ts">
import {useRouter, useRoute} from 'vue-router'
import {ref, computed} from 'vue'
const route = useRoute();
const router = useRouter();


const props = defineProps<{
    profileUsername : string
    profileLogin42: string
}>()

const display = computed(() => {
    return !(route.fullPath == "/chat");
})

async function sendMessage() {
   router.push("/chat");
}

</script>

<template>
    <button v-if="display" type="button" class="btn btn-outline-primary" @click="sendMessage">Message</button>
</template>