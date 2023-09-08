import { User } from '../user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, OneToMany, Timestamp, ManyToOne, JoinColumn, Relation, OneToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Chat
{
	@PrimaryGeneratedColumn('increment')
    id: number

	@Column({type: "text"})
	name: string;
	
	@Column({ type: "text", default: null})
	password: string | null

	@OneToMany(() => ChatMessage, (message) => message.chat, {cascade: true})
	messages: Relation<ChatMessage[]>;

	@ManyToMany(() => User, (user) => user.chats)
	@JoinTable()
	chatters: Relation<User[]>;
	
	@ManyToMany(() => User, (user) => user.muted)
	@JoinTable()
	mutes: Relation<User[]>;

	@ManyToMany(() => User, (user) => user.banned)
	@JoinTable()
	bans: Relation<User[]>;

	@ManyToOne(() => User, (user) => user.owned)
	owner: Relation<User>;
	
	@ManyToMany(() => User, (user) => user.administered)
	@JoinTable()
	admins: Relation<User[]>;

	@Column({type: "boolean", default: false})
	isPrivate: boolean;

	@Column({type: "boolean", default: false})
	isDm: boolean;
}

@Entity()
export class ChatMessage 
{
	// @PrimaryColumn({ type: "timestamptz", default: Date.now()})
	// time: Date;
	@PrimaryGeneratedColumn('increment')
    id: number;

	@Column({type: 'timestamp',  nullable: false, default: () => 'CURRENT_TIMESTAMP' })
	time: Date;

	@Column()
	message: string;

	@ManyToOne(() => User, (user) => user.messages)
	user: Relation<User>;

	@ManyToOne(() => Chat, (chat) => chat.messages)
	chat: Relation<Chat>;
}





