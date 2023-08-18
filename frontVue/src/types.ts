export interface match {
    id: number,
    player1: string,
    player2: string,
    score1: number,
    score2: number
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
    has2fa: boolean
  }