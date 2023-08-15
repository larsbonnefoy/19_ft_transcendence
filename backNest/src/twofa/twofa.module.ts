import { Module } from '@nestjs/common';
import { TwofaService } from './twofa.service';
import { TwofaController } from './twofa.controller';
import { Api42Module } from '../api42/api42.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule, Api42Module],
  controllers: [TwofaController],
  providers: [TwofaService],
  exports: [TwofaService]
})
export class TwofaModule {}
