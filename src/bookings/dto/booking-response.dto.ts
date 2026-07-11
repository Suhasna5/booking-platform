import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '../entities/booking-status.enum';

// Exposes booking data without leaking the persistence entity.
export class BookingResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() customerName!: string;
  @ApiProperty() customerEmail!: string;
  @ApiProperty() customerPhone!: string;
  @ApiProperty({ format: 'uuid' }) serviceId!: string;
  @ApiProperty() bookingDate!: string;
  @ApiProperty() bookingTime!: string;
  @ApiProperty({ enum: BookingStatus }) status!: BookingStatus;
  @ApiProperty({ nullable: true }) notes!: string | null;
  @ApiProperty() createdAt!: Date;
  @ApiProperty() updatedAt!: Date;
}
