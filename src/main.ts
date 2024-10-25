import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('OTUS API Title')
    .setDescription('API description')
    .setVersion('1.0')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const result = errors.map((error) => {
          // Check if constraints are defined
          const constraints = error.constraints ? error.constraints : {};

          return {
            property: error.property, // The property that failed validation
            message: Object.values(constraints)[0] || 'Unknown validation error', // The first error message or a default message
          };
        });
        // Return a BadRequestException with the structured result
        return new BadRequestException(result);
      },
      stopAtFirstError: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
