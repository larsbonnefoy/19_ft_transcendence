import { Module } from '@nestjs/common';
import { Api42Controller } from './api42/api42.controller';
import { Api42Module } from './api42/api42.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ServeStaticModule } from '@nestjs/serve-static'; // New
// import { join } from 'path'; // New

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { DataSource } from 'typeorm';

import { Match } from './match/match.entity';
import { MatchModule } from './match/match.module';

import { Api42Service } from './api42/api42.service';
import { HttpModule } from '@nestjs/axios';
import { Axios, AxiosResponse } from 'axios';
import { TwofaModule } from './twofa/twofa.module';
import { ChatModule } from './chat/chat.module';
import { ChatMessage } from './chat/chat.entity';
import { Chat } from './chat/chat.entity';
import { TwofaController } from './twofa/twofa.controller';


@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: 'localhost', // if running with docker, comment this and use line below
    //   host: 'host.docker.internal', //https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach
      host: 'postgres',
    //   host: '172.18.0.3 ',
      port: +process.env.POSTGRES_DB_PORT, // for some reason it works like this sooooo lesgo

      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    entities: [User, Match, Chat, ChatMessage],
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([User, Match, Chat, ChatMessage]),
    UserModule,
    MatchModule,
    Axios,
    HttpModule,
    Api42Module,
    TwofaModule,
    ChatModule,
    // ServeStaticModule.forRoot({ // New
      // rootPath: '/usr/src/app/frontVue',//join(__dirname, '/../', 'frontVue'), // New
    // }), // New
  ],
  controllers: [Api42Controller, AppController, TwofaController],
  providers: [AppService, Api42Service],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
