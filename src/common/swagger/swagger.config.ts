import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Builds the shared OpenAPI document shown to API consumers.
export function configureSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Booking Platform API')
    .setDescription('REST API for managing services and customer bookings.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);
}
