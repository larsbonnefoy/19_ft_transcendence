import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import CreateAccount from '@/views/CreateAccount.vue';
import Home from '@/views/Home.vue';
import Game from '@/views/Game.vue';
import Chat from '@/views/Chat.vue';
import loginIntra from '@/views/loginIntra.vue';
import auth from '@/views/Auth.vue';


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
      window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-2f106f36bdac3ac02f5555c178177423c9af72f59dc797d1fd439cdec8ca9985&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fauth&response_type=code`;
  	  }
	},
	{
      path: '/auth',
      name: 'auth',
      component: auth,
    }
  ]
})

export default router
