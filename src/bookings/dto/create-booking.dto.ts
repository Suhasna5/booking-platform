import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

// Captures the customer contact details and requested slot for a public booking.
export class CreateBookingDto {
  @ApiProperty({ example: 'Jane Doe' })
  @IsString()
  @MinLength(1)
  @MaxLength(150)
  customerName!: string;

  @ApiProperty({ example: 'jane@example.com' })
  @IsEmail()
  @MaxLength(254)
  customerEmail!: string;

  @ApiProperty({ example: '+1-555-0100' })
  @IsString()
  @MinLength(1)
  @MaxLength(30)
  customerPhone!: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  serviceId!: string;

  @ApiProperty({ example: '2026-08-01', description: 'ISO date (YYYY-MM-DD)' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'bookingDate must be YYYY-MM-DD' })
  bookingDate!: string;

  @ApiProperty({
    example: '14:30',
    description: '24h time (HH:mm or HH:mm:ss)',
  })
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'bookingTime must be HH:mm or HH:mm:ss',
  })
  bookingTime!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
