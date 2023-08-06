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


import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
// import { Photo } from '../photos/photo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

//   @OneToMany(type => Photo, photo => photo.user)
//   photos: Photo[];
}
