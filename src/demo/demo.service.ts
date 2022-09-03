import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Config } from '../config';
import { IConfig } from './interface/config.interface';

@Injectable()
export class DemoService {
  constructor(private readonly configService: ConfigService<Config>) {}

  getConfig(): Promise<IConfig> {
    return Promise.resolve({
      nodeEnv: this.configService.get('NODE_ENV'),
      applicationPort: this.configService.get('APPLICATION_PORT'),
    });
  }
}
