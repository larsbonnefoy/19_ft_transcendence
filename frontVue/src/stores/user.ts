import { defineStore } from 'pinia'
import axios from "axios"
import {type UserInfo} from '../types'
import { socket } from '../socket';

export const useUserStore = defineStore('user', {
    state: () => ({
        // for data that is not yet loaded
        user: null as UserInfo | null,
    }),
    getters: {
        getUser: (state): UserInfo | null => state.user,
        getUserName: (state) => state.user?.username,
        getDisplayLogin: (state) => state.user?.displayLogin,
        getStatus: (state) => state.user?.status,
        getImg: (state) => state.user?.photo,
        getFriends: (state) => state.user?.friends,
        getBlocked: (state) => state.user?.blocked_users,
        getLogin42: (state) => state.user?.login42,
        get2fa: (state) => state.user?.has2fa,
        getWin: (state) => state.user?.win,
        getLoss: (state) => state.user?.loss,
        getAchievement: (state) => state.user?.achievements,
        getPending: (state) => state.user?.pending,
    },
    actions: {
        async fetchUser() {
          try {
				if (this.user) {
					URL.revokeObjectURL(this.user.photo); //to release memory
				}
                const data = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/api42/getLoggedUser/`, {token: localStorage.getItem('jwt_token')});
                this.user = data.data;
				if (this.user) {
					this.user.photo = await this.getAvatar(this.user.photo);
					this.user.status = "online"; //little trick to be online when you reload your own profile
				}
 				socket.emit('joinMyRoom', localStorage.getItem('jwt_token')); //each user has his own personal room in which he can be contacted
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
                        const data = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/twofa/enable/`, {token: localStorage.getItem('jwt_token')});
                        this.user.has2fa = value;
                        console.log(data);
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                if (!value) {
                    try {
                        const data = await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/twofa/disable/`, {token: localStorage.getItem('jwt_token')});
                        this.user.has2fa = value;
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
        },
        async changeDisplayLogin(value: boolean) {
            console.log(value);
        },
        async setName(newUsername:string) {
            if (this.user) {
                    await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/change_username:${newUsername}`, { headers: {token: localStorage.getItem('jwt_token')} });
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
                    await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/setStatus:${statusValue}`, { headers: {token: localStorage.getItem('jwt_token')} });
                    this.user.status = newStatus;
                }
                catch (error) {
                }
            }
        },
		async setAvatar(image:any) {
			const formData = new FormData();
            formData.append('file', image);
            const headers = { 'Content-Type': 'multipart/form-data', token: localStorage.getItem('jwt_token') };
			try {
				await axios.post(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/avatar`, formData, { headers });//.then((res) => {
				// 	res.data.files; // binary representation of the file
				// 	res.status; // HTTP status
				// });
			}
			catch (error) {throw error}
		},
		async getAvatar(imgpath: string) : Promise<string> {
			if (imgpath === "no photo yet")
				return  "../../assets/placeholder_avatar.png";
			else if (imgpath.slice(0, 5) === "https") //is still intra photo, which we don't store ourself since it's a url
				return imgpath;
			try {
				const res = await fetch(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/avatar:${imgpath}`);
				if (res.status === 200) {
					const blob = await res.blob();
					return (URL.createObjectURL(blob));
				}
			}
			catch (error) {}
			return "../../assets/placeholder_avatar.png";
		},
        async addFriend(newFriendLogin: string) {
            const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/add_friend:${newFriendLogin}`, { headers: {token: localStorage.getItem('jwt_token')} })
        },
        async unsendFriendRequest(newFriendLogin: string) {
            await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/remove_request:${newFriendLogin}`, { headers: {token: localStorage.getItem('jwt_token')} })
        },
        async acceptFriendRequest(newFriendLogin: string) {
            await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/accept_request:${newFriendLogin}`, { headers: {token: localStorage.getItem('jwt_token')} })
            if (this.user != null) {
                this.user.pending = this.user?.pending.filter(name => name !== newFriendLogin);
            }
            this.user?.friends.push(newFriendLogin);
        },
        async declineFriendRequest(newFriendLogin: string) {
            try {
                const res = await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/refuse_request:${newFriendLogin}`, { headers: {token: localStorage.getItem('jwt_token')} });
                if (this.user) {
                    this.user.pending = this.user?.pending.filter(name => name !== newFriendLogin)
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async removeFriend(FriendtoRemoveLogin: string) {
            await axios.get(`http://${import.meta.env.VITE_LOCAL_IP}:${import.meta.env.VITE_BACKEND_PORT}/user/unset_friend:${FriendtoRemoveLogin}`, { headers: {token: localStorage.getItem('jwt_token')} })
            if (this.user) {
                this.user.friends = this.user?.friends.filter(name => name !== FriendtoRemoveLogin)
            }
        },
      },
     persist: true,
  })