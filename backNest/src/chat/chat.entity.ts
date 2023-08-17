import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, Timestamp, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class ChatMessage 
{
	// @PrimaryColumn({ type: "timestamptz", default: Date.now()})
	// time: Date;
	@PrimaryColumn({ type: "text", default: 'oi'})
	time: string;

	@Column()
	message: string;

	@Column()
	user_login42: string;

	@Column()
	chat_id: string;

	// @ManyToOne(() => Chat, chat => chat.id)
	// @JoinColumn({ name: 'chat_id' })
	// chat: Chat;
}


@Entity()
export class Chat
{
	@PrimaryColumn({type: "text", unique: true})
	id: string;
	
	@Column({ type: "text", default: null})
	password: string

}


