import { defineStore } from 'pinia'
import axios from "axios"
import {type UserInfo} from '../types' 

export const useUserStore = defineStore('user', {
    state: () => ({
        // for data that is not yet loaded
        user: null as UserInfo | null,
    }),
    getters: {
        getUser: (state): UserInfo | null => state.user,
        getUserName: (state) => state.user?.username,
        getStatus: (state) => state.user?.status,
        getImg: (state) => state.user?.photo,
        getFriends: (state) => state.user?.friends,
        getPending: (state) => state.user?.pending,
        getBlocked: (state) => state.user?.blocked_users,
        getLogin42: (state) => state.user?.login42,
        get2fa: (state) => state.user?.has2fa,
        getWin: (state) => state.user?.win,
        getLoss: (state) => state.user?.loss,
        getAchievement: (state) => state.user?.achievements,
    },
    actions: {
        async fetchUser() {
          try {
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
        //What happens if change 2fa but token not valid anymore?? (=> No token or expired token)
        async change2fa(value: boolean) {
            if (this.user) { 
                if (value) {
                    try { 
                        const data = await axios.post('http://localhost:3000/twofa/enable/', {token: sessionStorage.getItem('jwt_token')});
                        this.user.has2fa = value;
                        console.log(data);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                if (!value) {
                    try {
                        const data = await axios.post('http://localhost:3000/twofa/disable/', {token: sessionStorage.getItem('jwt_token')});
                        this.user.has2fa = value;
                        console.log(data);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
        },
        async setName(newUsername:string) {
            if (this.user) {
                    await axios.get(`http://localhost:3000/user/change_username:${newUsername}`, { headers: {token: sessionStorage.getItem('jwt_token')} });
                    this.user.username = newUsername;
            }
        },
        async setStatus(newStatus:string) {
            let statusValue: number;
            if (this.user) { 
                switch(newStatus) {
                    case"online":
                        statusValue = 0;
                        break;
                    case"offline":
                        statusValue = 1;
                        break;
                    case "ingame":
                        statusValue = 2;
                        break;
                    default:
                        statusValue = -1; //if written wrong, will endup making backend fail and throw error 
                }
                try { 
                    await axios.get(`http://localhost:3000/user/setStatus:${statusValue}`, { headers: {token: sessionStorage.getItem('jwt_token')} });
                    this.user.status = newStatus;
                }
                catch (error) {
                }
            }
        },
        async addFriend(newFriend: string) {
            await axios.get(`http://localhost:3000/user/add_friend:${newFriend}`, { headers: {token: sessionStorage.getItem('jwt_token')} })
        },
        async acceptFriendRequest(newFriend: string) {
            const resLogin = await axios.get(`http://localhost:3000/user/LogFromUser:${newFriend}`)
            console.log(resLogin.data.login42);
            const res = await axios.get(`http://localhost:3000/user/accept_request:${newFriend}`, { headers: {token: sessionStorage.getItem('jwt_token')} })
            if (this.user != null) {
                this.user.pending = this.user?.pending.filter(name => name !== resLogin.data.login42);
            }
            this.user?.friends.push(resLogin.data.login42);
        },
        async declineFriendRequest(newFriend: string) {
            try {
                const resLogin = await axios.get(`http://localhost:3000/user/LogFromUser:${newFriend}`)
                console.log(resLogin.data.login42);
                const res = await axios.get(`http://localhost:3000/user/refuse_request:${newFriend}`, { headers: {token: sessionStorage.getItem('jwt_token')} });
                if (this.user) {
                    this.user.pending = this.user?.pending.filter(name => name !== resLogin.data.login42)
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async removeFriend(FriendtoRemove: string) {
            try {
                console.log("a");
                const resLogin = await axios.get(`http://localhost:3000/user/LogFromUser:${FriendtoRemove}`)
                console.log("b");
                const res = await axios.get(`http://localhost:3000/user/unset_friend:${FriendtoRemove}`, { headers: {token: sessionStorage.getItem('jwt_token')} })
                console.log("c");
                if (this.user) {
                    this.user.friends = this.user?.friends.filter(name => name !== resLogin.data.login42)
                }
            }
            catch (error) {
                console.log(error);
            }
        },
      },
     persist: true,
  })