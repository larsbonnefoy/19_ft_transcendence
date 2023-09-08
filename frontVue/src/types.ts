export interface match {
    id: number,
    player1: string,
    player2: string,
    score1: number,
    score2: number
    elo1: number,
    elo2: number,
    gMode: number,
}

export interface UserInfo {
    login42: string
    username: string
    displayLogin:  boolean
    status: string
    photo: string
    elo: number
    win: number
    loss: number
    friends: string[]
    pending: string[]
    blocked_users: string[]
    has2fa: boolean
    achievements: number
}

export interface LeaderBoardUserInfo {
    username: string
    elo: number
    win: number
    loss: number
    photo: string
}

export interface MemberInfo {
	username: string
	status: string
	elo: number
	photo: string
}

export interface Achievement {
    name: string
    imageUrl: string
    description: string
    progress(): number
	current: number
    max: number
}

export interface Channel
{
    id: number
    name: string
    messages: Messages[]
    chatters: UserInfo[]
    admins: UserInfo[]
    bans: UserInfo[]
    mutes: UserInfo[]
    owner: UserInfo
    isDm: boolean 
    isPrivate: boolean
}

export interface Messages
{
    id: number
    time: Date
    message: string
    user: UserInfo
    chat: Channel
}

export interface ChatInfo{
    ChannelList : Channel[]
    PublicList : Channel[]
}

export enum GameType {
    PLAYER,
    WATCHER
}