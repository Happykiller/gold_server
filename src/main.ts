import { Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';

import { config } from './config';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  logger.log(`Environnement selected: ${config.env.mode} on port ${config.env.port ?? 3000}`);
  
  require('events').EventEmitter.defaultMaxListeners = 50;
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '50KB' }));
  app.use(bodyParser.urlencoded({ limit: '50KB', extended: true }));
  app.enableCors();
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.append('Access-Control-Expose-Headers', '*');
    next();
  });
  await app.listen(config.env.port ?? 3000);
}
bootstrap();