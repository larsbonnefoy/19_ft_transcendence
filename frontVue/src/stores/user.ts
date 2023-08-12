import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from "axios"

export const useUserStore = defineStore('user', {
    state: () => ({
        // for data that is not yet loaded
        user: null as UserInfo | null,
    }),
    getters: {
        getUser(state) {
            return state.user 
        }, 
        getUserName: (state) => state.user?.username,
        getStatus: (state) => state.user?.status,
        getImg: (state) => state.user?.photo,
    },
    actions: {
        async fetchUser() {
          try {
                console.log("fetch user : " + sessionStorage.getItem('jwt_token'));
                const data = await axios.post('http://localhost:3000/api42/getLoggedUser/', {token: sessionStorage.getItem('jwt_token')});
                this.user = data.data;
                console.log("fetched user")
                console.log(data.data);
            }
            catch (error) {
            //   alert(error);
              console.log("fetch user error : " + error);
			  this.user = null;
          }
        },
        async setName(newUsername:string) {
            if (this.user) {
                const oldUsername = this.user.username;
				console.log("new");
                try {                    
                    await axios.get('http://localhost:3000/user/change_username/', { params: { old: oldUsername, new: newUsername } });
                    this.user.username = newUsername;
                }
                catch (error) {
                    return error;
                }
            }
        },
      },
      persist: true,
  })

  interface UserInfo {
    login42: string
    username: string
    password:string
    status: string
    photo: string
    elo: number
    win: number
    loss: number
    friends: UserInfo[]
  }