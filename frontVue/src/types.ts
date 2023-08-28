export interface match {
    id: number,
    player1: string,
    player2: string,
    score1: number,
    score2: number
    elo1: number,
    elo2: number
}

export interface UserInfo {
    login42: string
    username: string
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

export interface Achievement {
    name: string
    imageUrl: string
    description: string
    progress(): number //returns in % the completeness of the achievement, could return -1 if there is no progress to be tracked
	current: number
    max: number
}

export enum GameType {
    PLAYER,
    WATCHER,
    CHALLENGER
}