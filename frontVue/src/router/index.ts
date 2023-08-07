import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import CreateAccount from '@/views/CreateAccount.vue';
import Home from '@/views/Home.vue';
import Game from '@/views/Game.vue';
import Chat from '@/views/Chat.vue';
import loginIntra from '@/views/loginIntra.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
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
      path: '/game',
      name: 'game',
      component: Game
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat
    },
	{
      path: '/intraLogin',
      name: 'loginIntra',
      component: loginIntra,
	  beforeEnter(to, from, next) {
      window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${import.meta.env.API_UID}&redirect_uri=${import.meta.env.API_REDIRECT}&response_type=code`;
    }
    }
  ]
})

export default router
