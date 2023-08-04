import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { ServeStaticModule } from '@nestjs/serve-static'; // New
// import { join } from 'path'; // New
import { Api42Module } from './api42/api42.module';


@Module({
    // ServeStaticModule.forRoot({ // New
      // rootPath: '/usr/src/app/frontVue',//join(__dirname, '/../', 'frontVue'), // New
    // }), // New
  imports: [Api42Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
