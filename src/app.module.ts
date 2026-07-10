import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { BookingsModule } from './bookings/bookings.module';
import { ServicesModule } from './services/services.module';

@Module({
  imports: [AuthModule, ServicesModule, BookingsModule],
})
export class AppModule {}
