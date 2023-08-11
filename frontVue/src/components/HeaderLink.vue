<script setup lang="ts">
import {useRoute, type RouteRecordRaw} from 'vue-router'
import {computed, ref} from 'vue'

const props = defineProps<{
    route: RouteRecordRaw
}>()

const currentRoute = useRoute();

const isActive = computed(() => {
    return props.route.name == currentRoute.name
})

</script>

<template>
    <router-link 
    :to="route.path" 
    class="nav-link"
    :class="{active: isActive}"
    >
        {{ route.name }}
    </router-link>
</template>