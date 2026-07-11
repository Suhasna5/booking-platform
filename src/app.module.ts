import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { createDatabaseOptions } from './database/database.config';
import { ServicesModule } from './services/services.module';

// Composes the application's modules and shared infrastructure.
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: createDatabaseOptions,
    }),
    AuthModule,
    ServicesModule,
    BookingsModule,
  ],
})
export class AppModule {}
