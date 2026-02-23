import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as session from "express-session";
import * as passport from "passport";
import helmet from "helmet";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          ...helmet.contentSecurityPolicy.getDefaultDirectives(),
          "script-src": ["'self'", "'unsafe-inline'"],
          "img-src": ["'self'", "data:", "https://validator.swagger.io"],
        },
      },
    }),
  );
  app.enableCors({
    origin: configService.get<string>("CLIENT_URL", "http://localhost:3000"),
    credentials: true,
  });
  app.setGlobalPrefix("api");

  app.set("trust proxy", 1);

  app.use(
    session({
      secret: configService.getOrThrow<string>("SESSION_SECRET"),
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000, // 1 hour
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Automatically true in production with HTTPS
        sameSite: "lax", // Required for OAuth redirects
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("GitHandshake API")
    .setDescription("API for discovering good first issues across open source repositories")
    .setVersion("1.0")
    .addTag("issues", "Browse and fetch good first issues")
    .addTag("auth", "GitHub OAuth authentication")
    .addTag("github", "GitHub App integration")
    .addTag("health", "Service health check")
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  const logger = new Logger("Bootstrap");

  const portsString = configService.get<string>("PORTS", "3001");
  const ports = portsString.split(",").map((port) => parseInt(port.trim(), 10));

  let serverStarted = false;
  for (const port of ports) {
    try {
      await app.listen(port);
      serverStarted = true;
      logger.log(`Server listening on port ${port}`);
      break;
    } catch (error) {
      if (error.code === "EADDRINUSE") {
        logger.warn(`Port ${port} is already in use. Trying next port...`);
      } else {
        throw error;
      }
    }
  }

  if (!serverStarted) {
    throw new Error("Could not start server on any of the specified ports.");
  }
}
bootstrap();
