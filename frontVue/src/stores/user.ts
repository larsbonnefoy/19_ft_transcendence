import { defineStore } from 'pinia'
import axios from "axios"

export const useUserStore = defineStore('user', {
    state: () => ({
        // for data that is not yet loaded
        user: null as UserInfo | null,
        isLoggedIn: false,
    }),
    getters: {
        getUser(state) {
            return state.user 
        }, 
        getUserName: (state) => state.user?.username,
        getLogStatus: (state) => state.isLoggedIn,        
        getStatus: (state) => state.user?.status,

    },
    actions: {
        async fetchUser() {
          try {
                const data = await axios.get('http://localhost:3000/user/get/');
                this.user = data.data[0];
                
                console.log("fetched user")
                console.log(data.data[0]);
            }
            catch (error) {
              alert(error);
              console.log(error);
          }
        },
        async setName(newUsername:string) {
            if (this.user) {
                const oldUsername = this.user.username;
                try {                    
                    await axios.get('http://localhost:3000/user/change_username/', { params: { old: oldUsername, new: newUsername } });
                    this.user.username = newUsername;
                }
                catch (error) {
                    return error;
                }
            }
        },
        setLogStatus(statusValue: boolean) {
            this.isLoggedIn = statusValue;
        }
      },
      persist: true,
  })

  interface UserInfo {
    loggin42: string
    username: string
    password:string
    status: string
    elo: number
    win: number
    loss: number
    friends: UserInfo[]
  }