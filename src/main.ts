// src\main.ts
/* istanbul ignore file */
import { Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { NextFunction, Request, Response } from 'express';

import { config } from '@src/config';
import { AppModule } from '@src/app.module';
import inversify from '@src/inversify/investify';
import { configureAuthGuardFactory } from '@happykiller/sunny-apis';
import { runInRequestContext } from '@src/common/metrics/request.context';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  logger.log(
    `Environnement selected: ${config.env.mode} on port ${config.env.port ?? 3000}`,
  );

  require('events').EventEmitter.defaultMaxListeners = 50;
  const app = await NestFactory.create(AppModule);
  configureAuthGuardFactory({
    inversify,
    appConfig: config,
  });
  app.use(bodyParser.json({ limit: '50KB' }));
  app.use(bodyParser.urlencoded({ limit: '50KB', extended: true }));
  app.enableCors();
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.append('Access-Control-Expose-Headers', '*');
    next();
  });
  // Ouvre le contexte de mesure pour toute la durée de la requête. Doit
  // précéder le handler GraphQL : ce qui est exécuté hors de ce `run` ne sera
  // pas compté, et le compteur SQL rendrait alors 0 sans le dire.
  app.use((_req: Request, _res: Response, next: NextFunction) =>
    runInRequestContext(next),
  );
  await app.listen(config.env.port ?? 3000);
}
bootstrap();
