import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);

  app.use(
    session({
      secret: configService.get<string>('SESSION_SECRET', 'a-very-secret-key'),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1 hour
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const logger = new Logger('Bootstrap');

  const portsString = configService.get<string>('PORTS', '3001');
  const ports = portsString.split(',').map(port => parseInt(port.trim(), 10));

  let serverStarted = false;
  for (const port of ports) {
    try {
      await app.listen(port);
      serverStarted = true;
      logger.log(`Server listening on port ${port}`);
      break;
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        logger.warn(`Port ${port} is already in use. Trying next port...`);
      } else {
        throw error;
      }
    }
  }

  if (!serverStarted) {
    throw new Error('Could not start server on any of the specified ports.');
  }
}
bootstrap();

