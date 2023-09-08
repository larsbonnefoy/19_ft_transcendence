
import { Chat, ChatMessage } from '../chat/chat.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, Relation, ManyToMany, ManyToOne } from 'typeorm';
// import { Photo } from '../photos/photo.entity';

export const UserStatus: Array<string> = ["online", "offline", "ingame"];

@Entity()
export class User {
  //   @PrimaryGeneratedColumn()
  @PrimaryColumn({ type: "text", unique: true })
  login42: string;
  
  @Column({ type: "text", unique: true })
  username: string;

  @Column({ type:"boolean", default: "true"})
  displayLogin: boolean;

  @Column({type: "text", default: ""})
  client_id: string;
  
  @Column({type: 'numeric', default: 1000})
  elo: number;
  
  @Column({ type: "text", default: UserStatus[1] })
  status: string;
  
  @Column({type: "simple-array", default: ""})
  friends: string[];
  
  @Column({type: "simple-array", default: ""})
  pending: string[];
  
  @Column({type: "simple-array", default: ""})
  blocked_users: string[];
  
  @Column({type: 'numeric', default: 0})
  win: number;
  
  @Column({type: 'numeric', default: 0})
  loss: number;
  
  @Column({type: 'numeric', default: 0})
  achievements: number;

  @Column({ type: "text", default: "no photo yet" })
  photo: string; // TODO, don't know how to store a photo yet
  
  @Column({ type: "boolean", default: "false" })
  has2fa: boolean;  

  @Column({ type: "bytea", default: null})
  twofaSecret: Buffer | null; 


  //CHAT PART OF THE ENTiTY
  @OneToMany(() => ChatMessage, (message) => message.chat, {cascade: true})
  messages: Relation<ChatMessage[]>;

  @ManyToMany(() => Chat, (chat) => chat.chatters)
  chats: Relation<Chat[]>;

  @ManyToMany(() => Chat, (chat) => chat.bans)
  banned: Relation<Chat[]>;
  
  @ManyToMany(() => Chat, (chat) => chat.mutes)
  muted: Relation<Chat[]>;

  @OneToMany(() => Chat, (chat) => chat.owner, {cascade: ['insert']})
  owned: Relation<Chat[]>;

  @ManyToMany(() => Chat, (chat) => chat.chatters)
  administered: Relation<Chat[]>;
}
  // import {
  //     Entity,
  //     Column,
  //     PrimaryGeneratedColumn,
  //     CreateDateColumn,
  // } from 'typeorm';
      
  // @Entity()
  // export class User {
  // @PrimaryGeneratedColumn('uuid')
  // id: number;
  
  // @Column()
  // name: string;
  
  // @Column()
  // password: string;
  // }
  
