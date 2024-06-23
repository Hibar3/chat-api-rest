import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerConfig } from './config/docs/swagger.config';
import { ValidateInputPipe } from './config/pipe/validate.pipe';
import { SocketIoAdapter } from './socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  SwaggerConfig.config(app);
  app.enableCors(); // Allow requests from the same origin

  // DTO validation pipe configuration
  // app.useGlobalPipes(new ValidateInputPipe());
  app.useWebSocketAdapter(new SocketIoAdapter(app));
  await app.listen(process.env.PORT || 4000);
}

bootstrap();
