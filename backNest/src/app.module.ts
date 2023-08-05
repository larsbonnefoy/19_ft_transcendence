import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ServeStaticModule } from '@nestjs/serve-static'; // New
// import { join } from 'path'; // New
import { Api42Module } from './api42/api42.module';
import { Api42Controller } from './api42/api42.controller';
import { Api42Service } from './api42/api42.service';
import { HttpModule } from '@nestjs/axios';
import { Axios, AxiosResponse } from 'axios';



@Module({
    // ServeStaticModule.forRoot({ // New
      // rootPath: '/usr/src/app/frontVue',//join(__dirname, '/../', 'frontVue'), // New
    // }), // New
imports: [Axios, HttpModule, Axios, Api42Module],
  controllers: [Api42Controller, AppController],
  providers: [AppService, Api42Service],
})
export class AppModule {}
