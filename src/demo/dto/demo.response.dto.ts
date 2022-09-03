import { IConfig } from '../interface/config.interface';

export class ConfigResponseDto implements IConfig {
  nodeEnv: string;
  applicationPort: string;
}
