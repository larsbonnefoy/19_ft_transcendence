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
            return this.user?.name
        },
    },
    actions: {
        async fetchUsers() {
          try {
                const data = await axios.get('../public/User.json');
                this.user = data.data;
                //console.log(this.user?.name);
            }
            catch (error) {
              alert(error);
              console.log(error);
          }
        },
      },
  })

  interface UserInfo {
    name: string
    elo: number
    status: boolean
    logged: boolean
  }