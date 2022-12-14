import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { resolveDynamicProviders } from 'nestjs-dynamic-providers';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './discord/filters/bad-request.filter';
async function bootstrap(): Promise<void> {
  await resolveDynamicProviders();
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(helmet());

  app.useGlobalFilters(new HttpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('Chan API')
    .setVersion('1.0')
    .setLicense('WTFPL', 'https://choosealicense.com/licenses/wtfpl/#')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(3333);
}
void bootstrap();
