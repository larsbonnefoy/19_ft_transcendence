import { defineStore } from 'pinia'
import axios from "axios"

export const useUserStore = defineStore('user', {
    state: () => ({
        // for data that is not yet loaded
        user: null as UserInfo | null,
    }),
    getters: {
        getUsers(state) {
            return state.user 
        }, 
        getUserName(state) {
            return this.user?.loggin42
        },
    },
    actions: {
        async fetchUsers() {
          try {
                const data = await axios.get('http://localhost:3000/user/get');
                console.log(data.data[0]);
                this.user = data.data[0];
            }
            catch (error) {
              alert(error);
              console.log(error);
          }
        },
      },
  })

  interface UserInfo {
    loggin42: string
    username: string
    password:string
    status: string
    elo: number
  }