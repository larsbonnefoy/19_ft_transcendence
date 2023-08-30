<script setup lang="ts">
import {ref, computed, watch, reactive} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import { useUserStore } from '@/stores/user';

import HeaderLink from './HeaderLink.vue';
import { socket } from '@/socket';
const route = useRoute();
const router = useRouter();
const store = useUserStore();


const toDisplayNav = ['home', 'chat', 'game', 'members'];
const toDisplayWhere = ['home', 'chat', 'game', 'members', 'profile', 'challenge'];

const routesToDisplay = router.options.routes.filter( value => toDisplayNav.includes(value.name));

const displayLinks = computed(() => {
    // console.log(route.name);
    return toDisplayWhere.includes(route.name);
});

const logout = async () => {
    // await store.setStatus("offline");
    localStorage.clear();
	socket.disconnect();
	socket.connect();
}

</script>

<template>
    <nav class="navbar-dark bg-dark navbar navbar-expand-lg">
        <div class="container-fluid">
            <router-link to="/home" class="navbar-brand">
                ft_pong
            </router-link>
            <template v-if="displayLinks">
                <div class="collapse navbar-collapse" id="navbarNav">
                    <div v-for="(route, index) in routesToDisplay" :key="index">
                        <ul class="navbar-nav">
                            <li>
                                <HeaderLink :route="route"> </HeaderLink>
                            </li>
                        </ul>
                    </div>
                </div>
          
                <div class="btn-group mx-2">
                    <button type="button" class="btn btn-outline-secondary dropdown-toggle mx-3" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        {{ store.getUserName }}
                    </button>
                        <div class="dropdown-menu dropdown-menu-right">
                            <router-link 
                            :to="{
                                name:'profile',
                                params: {
                                    username: store.getUserName
                                }
                            }" 
                            class="dropdown-item">
                                Profile
                            </router-link>
                            <div class="dropdown-divider"></div>
                            <router-link to="/" class="dropdown-item" @click.native="logout">
                                LogOut
                            </router-link>
                        </div>
                    </div>
                <router-link 
               	:to="{
        	       	name:'profile',
                   	params: {
                       	username: store.getUserName
                   	}
               	}"
                >
                    <img class="mx-3" :src=store.getImg >
                </router-link>
            </template>
        </div>
    </nav>
</template>

<style scoped>
img {
    height: 60px;
    width: auto;
    border-radius: 20%;
}
</style>