// import { DataSource } from 'typeorm';
// import { chatMessage } from './chat.entity';

// export const chatDatabaseProviders = [
// 	{
// 		provide: 'CHAT_DATA_SOURCE',
// 		useFactory: async () => {
// 			const dataSource = new DataSource({
// 				type: 'postgres',
//       			host: 'localhost', // if running with docker, comment this and use line below
//     			//   host: 'host.docker.internal', //https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach
// 				port: Number(process.env.POSTGRESS_DB_PORT),
//      			username: process.env.POSTGRES_USER,
//      			password: process.env.POSTGRES_PASSWORD,
//      			database: process.env.POSTGRES_DB_PREFIX + '_' + process.env.POSTGRES_DB_NAME_CHAT,
// 				entities: [chatMessage],
// 				// synchronize: true,
// 			});

// 			return dataSource.initialize();
// 		}
// 	}
// ]
