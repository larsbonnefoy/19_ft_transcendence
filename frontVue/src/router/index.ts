import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Game from '@/views/Game.vue';
import Chat from '@/views/Chat.vue';
import Auth from '@/views/Auth.vue';
import Profile from '@/views/Profile.vue';
import ShowUsers from '@/views/ShowUsers.vue';
import Admin from '@/views/Admin.vue';
import ErrorPage from '@/views/Error.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
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
      path: '/auth',
      name: 'auth',
      component: Auth,
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin

    },
    {
      path: '/showUsers',
      name: 'showUsers',
      component: ShowUsers
    },
    {
      path: '/:notFound',
      name: 'default',
      component: ErrorPage
    }
  ]
})

export default router
