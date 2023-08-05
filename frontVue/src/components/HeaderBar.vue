<script setup lang="ts">
import {ref, computed, watch, reactive} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import HeaderBarLink from './HeaderBarLink.vue'
const route = useRoute();
const router = useRouter();


const toDisplay = ['home', 'chat', 'game'];
const routesToDisplay = router.options.routes.filter( value => toDisplay.includes(value.name));

const displayLinks = computed(() => {
    return toDisplay.includes(route.name);
});

/*
watch(() => route.name, () => {
  console.debug(route.name);
      // Optionally you can set immediate: true config for the watcher to run on init
      //}, { immediate: true });
});
*/
</script>

<template>
    <nav class="navbar-dark bg-dark navbar navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">ft_pong</a>
            
            <!--
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
            </button>
            -->
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <template v-if="displayLinks">
                <div v-for="(route, index) in routesToDisplay" :key="index">
                    <ul class="navbar-nav">
                    <li>
                      <router-link :to="route.path" class="nav-link">
                        {{ route.name }}
                      </router-link>
                    </li>
                    </ul>
                </div>
                </template>
            </div>
            
        
            <!--
            <form class="d-flex">
                <button
                class="btn"
                :class="[`btn-outline-${offTheme}`]"
                @click.prevent="changeTheme()">Toggle
                </button>
            </form>
            -->
        </div>
    </nav>
</template>

<style scoped>
img {
    width: 32px;
    height: 32px;
}
</style>
