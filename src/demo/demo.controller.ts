import { Controller, Get } from '@nestjs/common';
import { DemoService } from './demo.service';
import { ConfigResponseDto } from './dto/demo.response.dto';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  @Get()
  getConfig(): Promise<ConfigResponseDto> {
    return this.demoService.getConfig();
  }
}
