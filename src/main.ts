import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { resolveDynamicProviders } from 'nestjs-dynamic-providers';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  await resolveDynamicProviders();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Chan API')
    .setVersion('1.0')
    .addApiKey({
      type: 'apiKey',
      name: 'x-api-key',
      in: 'header',
    })
    .setLicense('WTFPL', 'https://choosealicense.com/licenses/wtfpl/#')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3333);
}
void bootstrap();
