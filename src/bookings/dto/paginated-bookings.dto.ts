import { ApiProperty } from '@nestjs/swagger';
import { BookingResponseDto } from './booking-response.dto';

// Wraps a page of bookings with the totals a client needs to paginate.
export class PaginatedBookingsDto {
  @ApiProperty({ type: BookingResponseDto, isArray: true })
  items!: BookingResponseDto[];

  @ApiProperty() page!: number;
  @ApiProperty() limit!: number;
  @ApiProperty() total!: number;
}
