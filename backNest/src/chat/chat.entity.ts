import { User } from '../user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, Timestamp, ManyToOne, JoinColumn, Relation, OneToOne, ManyToMany } from 'typeorm';

@Entity()
export class ChatMessage 
{
	// @PrimaryColumn({ type: "timestamptz", default: Date.now()})
	// time: Date;
	@PrimaryColumn({type: 'timestamp',  nullable: false, default: () => 'CURRENT_TIMESTAMP' })
	time: Date;

	@Column()
	message: string;

	@ManyToOne(() => User, (user) => user.messages )
	user: Relation<User>;

	@ManyToOne(() => Chat, (chat) => chat.messages)
	chat: Relation<Chat>;
}


@Entity()
export class Chat
{
	@PrimaryColumn({type: "text", unique: true})
	id: string;
	
	@Column({ type: "text", default: null})
	password: string

	@OneToMany(() => ChatMessage, (message) => message.chat)
	messages: Relation<ChatMessage[]>;

	@ManyToMany(() => User, (user) => user.chats)
	chatters: Relation<User[]>;
	
	@ManyToOne(() => User, (user) => user.owned)
	owner: Relation<User>;
	
	@ManyToMany(() => User, (user) => user.administered)
	admins: Relation<User[]>;
}


