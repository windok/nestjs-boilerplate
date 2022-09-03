import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // ignoreEnvFile: true,
    }),
  ],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
