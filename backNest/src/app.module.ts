import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule} from '@nestjs/serve-static'; // New
import { join } from 'path'; // New

@Module({
  imports: [
    ServeStaticModule.forRoot({ // New
      rootPath: '/Users/yhuberla/Documents/cursus/19_transendence/frontVue',//join(__dirname, '/../', 'frontVue'), // New
    }), // New
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
