import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, INestApplication } from "@nestjs/common";
import * as express from "express";

function bootstrapSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Cabinet BackEnd API')
    .setDescription('cabinet order system version 1.0')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'authorization',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // appendFileSync('./swagger-spec.json', JSON.stringify(document));
  SwaggerModule.setup('api', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.use("/uploads", express.static("./public"));
  app.setGlobalPrefix("api");
  bootstrapSwagger(app);

  await app.listen(8888);
  Logger.log(`Listened on PORT ${process.env.PORT}`);
}
bootstrap();
