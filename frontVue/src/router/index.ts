import { createRouter, createWebHistory } from 'vue-router';

import Landing from '@/views/Landing.vue';
import Login from '@/views/Login.vue';
import CreateAccount from '@/views/CreateAccount.vue';
import Home from '@/views/Home.vue';
import Game from '@/views/Game.vue';
import Chat from '@/views/Chat.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing,
    },
    {
      path: '/createAccount',
      name: 'Create Account',
      component: CreateAccount,
    },
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/game',
      name: 'game',
      component: Game
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    }
  ]
})

export default router
