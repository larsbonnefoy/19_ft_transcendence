import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import CreateAccount from '@/views/CreateAccount.vue';
import Home from '@/views/Home.vue';
import Game from '@/views/Game.vue';
import Chat from '@/views/Chat.vue';
import Profile from '@/views/Profile.vue';
import AddUser from '@/views/AddUser.vue';
import ShowUsers from '@/views/ShowUsers.vue';



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
      path: '/profile',
      name: 'profile',
      component: Profile
    },
    {
      path: '/addUser',
      name: 'addUser',
      component: AddUser
    },
    {
      path: '/showUsers',
      name: 'showUsers',
      component: ShowUsers
    },
  ]
})

export default router
