import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BookingQueryDto } from './dto/booking-query.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginatedBookingsDto } from './dto/paginated-bookings.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';
import { BookingsService } from './bookings.service';

// Public booking creation plus JWT-protected staff management routes.
@ApiTags('Bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  // Creates a booking for a customer; open to the public.
  @Post()
  @ApiCreatedResponse({ type: BookingResponseDto })
  create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  // Lists a filtered, paginated page of bookings for staff.
  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: PaginatedBookingsDto })
  findAll(@Query() query: BookingQueryDto) {
    return this.bookingsService.findAll(query);
  }

  // Gets one booking for staff.
  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BookingResponseDto })
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(id);
  }

  // Transitions a booking to a new status for staff.
  @Patch(':id/status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BookingResponseDto })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBookingStatusDto) {
    return this.bookingsService.updateStatus(id, dto.status);
  }

  // Cancels a booking for staff.
  @Patch(':id/cancel')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({ type: BookingResponseDto })
  cancel(@Param('id') id: string) {
    return this.bookingsService.cancel(id);
  }
}
