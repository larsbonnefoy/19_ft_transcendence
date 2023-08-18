
import { Chat, ChatMessage } from '../chat/chat.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, Relation, ManyToMany, ManyToOne } from 'typeorm';
// import { Photo } from '../photos/photo.entity';

export enum UserStatus {
  ONLINE = "online",
  OFFLINE = "offline",
  INGAME = "ingame",
}

@Entity()
export class User {
  //   @PrimaryGeneratedColumn()
  @PrimaryColumn({ type: "text", unique: true })
  login42: string;
  
  @Column({ type: "text", unique: true })
  username: string;
  
  @Column({type: 'numeric', default: 1000})
  elo: number;
  
  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ONLINE })
  status: UserStatus;
  
  @Column({type: "simple-array", default: ""})
  friends: string[];
  
  @Column({type: 'numeric', default: 0})
  win: number;
  
  @Column({type: 'numeric', default: 0})
  loss: number;

  @Column({ type: "text", default: "no photo yet" })
  photo: string; // TODO, don't know how to store a photo yet
  
  @Column({ type: "boolean", default: "false" })
  has2fa: boolean;  

  @Column({ type: "bytea", default: null})
  twofaSecret: Buffer | null; 


  //CHAT PART OF THE ENTiTY
  @OneToMany(() => ChatMessage, (message) => message.chat)
  messages: Relation<ChatMessage[]>;

  @ManyToMany(() => Chat, (chat) => chat.chatters)
  chats: Relation<Chat[]>;

  @OneToMany(() => Chat, (chat) => chat.owner)
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
  
