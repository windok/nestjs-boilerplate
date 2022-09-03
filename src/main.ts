import { config as populateProcessEnvConfigFromFile } from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import { useContainer } from 'class-validator';
import helmet from 'helmet';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

populateProcessEnvConfigFromFile();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    abortOnError: true,
    bufferLogs: true,
    autoFlushLogs: true,
  });

  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: false,
      transform: false,
      exceptionFactory: errors => new BadRequestException({ message: 'VALIDATION_ERROR', errors }),
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(helmet());

  const documentBuilder = new DocumentBuilder()
    .setTitle('Boilerplate API')
    .setDescription('Boilerplate API')
    .setVersion('0.0.1')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'hex' }, 'accessToken');

  const apiDocUrl: string = configService.get('SWAGGER_ENDPOINT');
  if (apiDocUrl) {
    apiDocUrl.split(',').forEach(url => documentBuilder.addServer(url));
  }

  const swaggerConfig = documentBuilder.build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.enableShutdownHooks();

  app.use(json({ limit: '2kb' }));
  app.use(urlencoded({ extended: true, limit: '2kb' }));

  await app.listen(+configService.get('APPLICATION_PORT'));
}
bootstrap();
