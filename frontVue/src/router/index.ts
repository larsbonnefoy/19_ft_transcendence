import { createRouter, createWebHistory } from 'vue-router';

import Login from '@/views/Login.vue';
import Home from '@/views/Home.vue';
import Game from '@/views/Game.vue';
import Chat from '@/views/Chat.vue';
import Member from '@/views/Members.vue';
import Auth from '@/views/Auth.vue';
import Profile from '@/views/Profile.vue';
import ShowUsers from '@/views/ShowUsers.vue';
import Admin from '@/views/Admin.vue';
import ErrorPage from '@/views/Error.vue';
import axios from 'axios';
import { useUserStore } from '@/stores/user';


async function validAccess(): Promise<boolean> {
  let jwt_token = localStorage.getItem("jwt_token");
  if (jwt_token) {
    try {
      const canAccess = await axios.post("http://localhost:3000/api42/isAuth", {token : jwt_token})
      return canAccess.data;
    }
    catch {
      return false;
    }
  }
  return false;
}

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
      component: Home,
      beforeEnter: async (to, from) => {
        const acces = await validAccess();
        if (!acces && to.name != '/') {
          return '/';
        }
        else {
          const store = useUserStore();
          await store.fetchUser();
        }
      }
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
      beforeEnter: async (to, from) => {
        const acces = await validAccess();
        if (!acces && to.name != '/') {
          return '/';
        }
      }
    },
    {
      path: '/game/:challenge',
      name: 'challenge',
      component: Game,
      beforeEnter: async (to, from) => {
        const acces = await validAccess();
        if (!acces && to.name != '/') {
          return '/';
        }
        console.log("to " + to.path);
        if (to.path !== "/game/challenge")
          return 'game';
      }
    },
    {
      path: '/chat',
      name: 'chat',
      component: Chat,
      beforeEnter: async (to, from) => {
        const acces = await validAccess();
        if (!acces && to.name != '/') {
          return '/';
        }
      }
    },
	{
		path: '/members',
		name: 'members',
		component: Member,
		beforeEnter: async (to, from) => {
			const acces = await validAccess();
			if (!acces && to.name != '/') {
			  return '/';
			}
		}
	},
	{
      path: '/auth',
      name: 'auth',
      component: Auth,
    },
    {
      path: '/profile/:username',
      name: 'profile',
      component: Profile,
      beforeEnter: async (to, from) => {
        const acces = await validAccess();
        if (!acces && to.name != '/') {
          return '/';
        }
        else {
          const store = useUserStore();
          //could only fetch friends list here with another function
          await store.fetchUser();
        }
      }
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
      name: 'notFound',
      component: ErrorPage
    },
    {
      path:'/:pathMatch(.*)*',
      name: 'default',
      component: ErrorPage
    }
  ]
})

export default router
