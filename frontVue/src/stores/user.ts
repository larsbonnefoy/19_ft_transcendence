import { defineStore } from 'pinia'
import axios from "axios"
import {type UserInfo} from '../types' 

export const useUserStore = defineStore('user', {
    state: () => ({
        // for data that is not yet loaded
        user: null as UserInfo | null,
    }),
    getters: {
        getUser: (state) => state.user,
        getUserName: (state) => state.user?.username,
        getStatus: (state) => state.user?.status,
        getImg: (state) => state.user?.photo,
        getFriends: (state) => state.user?.friends,
        getLogin42: (state) => state.user?.login42,

    },
    actions: {
        async fetchUser() {
          try {
                //console.log(sessionStorage.getItem('jwt_token'));

                const data = await axios.post('http://localhost:3000/api42/getLoggedUser/', {token: sessionStorage.getItem('jwt_token')});
                this.user = data.data;
                console.log("fetched user")
                console.log(data.data);
            }
            catch (error) {
              alert(error);
              console.log(error);
          }
        },
        async setName(newUsername:string) {
            if (this.user) {
                const oldUsername = this.user.username;
                //try {                    
                    await axios.get('http://localhost:3000/user/change_username/', { params: { old: oldUsername, new: newUsername } });
                    this.user.username = newUsername;
                    /*
                    return new Promise<number>((resolve) => {
                        resolve(200);
                    });
                //}
                //catch (error) {
                    return new Promise<number>((reject) => {
                        reject(409);
                    });
                // }
                */
            }
        },
      },
     persist: true,
  })
