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
        getUserName: (state) => state.user?.username,
    },
    actions: {
        async fetchUser() {
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
        async setName(newUsername:string) {
            if (this.user) {
                const oldUsername = this.user.username;
                console.log('From user.ts: ')
                console.log(this.user.username);
                try {
                    const res = await axios.get('http://localhost:3000/user/change_username/', { params: { old: oldUsername, new: newUsername } });
                    console.log(res)
                    this.user.username = newUsername;
                }
                catch (error) {
                    //should return to component that an error occured
                    alert(error);
                    console.log(error);
                }
                //update bd aswell
            }

        },
      },
  })

  //        


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