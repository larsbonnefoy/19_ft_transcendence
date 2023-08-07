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


import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany } from 'typeorm';
// import { Photo } from '../photos/photo.entity';

export enum UserStatus {
    ONLINE = "online",
    OFFLINE = "offline",
    INGAME = "ingame",
}

@Entity()
export class User {
//   @PrimaryGeneratedColumn()
  @PrimaryColumn({ type: "text" })
  loggin42: string;

  @Column({ type: "text", unique: true })
  username: string;
  
  @Column({ type: "text" })
  password: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ONLINE })
  status: UserStatus;

  @Column({type: 'numeric', default: 1000})
  elo: number;

//   @OneToMany(type => Photo, photo => photo.user)
//   photos: Photo[];
}
