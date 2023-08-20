<script setup lang="ts">
import Achievement from './Achievement.vue';
//Get individuals achievements from backendcall
const props = defineProps<{
    usernameProp : string
}>()

//could Create all achievements objects with function on how to calculate them here, and pass right object to for loop
const achievements = ["1game", "10games", "100games", "Incognito", "Flawless", "You and Me"];

</script>

<template>
    <h2 style="text-align: center; " class="m-5"> {{ props.usernameProp }}'s Achievements </h2>
    <div class="card text-white bg-dark overflow-auto shadow-lg m-5" style="max-width: 42rem; max-height: 65rem;">
        <template v-for="(achievement, index) in achievements" :key="index">
           <Achievement :achiev-name="achievement" :achiev-id="index" :achiev-status="true"> </Achievement>
        </template>
    </div>
</template>