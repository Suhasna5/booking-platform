import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from '../services/entities/service.entity';
import { BookingsController } from './bookings.controller';
import { Booking } from './entities/booking.entity';
import { BookingsService } from './bookings.service';

// Wires the Booking and Service repositories to the bookings controller and service.
@Module({
  imports: [TypeOrmModule.forFeature([Booking, Service])],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
