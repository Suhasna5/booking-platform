import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Not, Repository } from 'typeorm';
import { Service } from '../services/entities/service.entity';
import { BookingQueryDto } from './dto/booking-query.dto';
import { BookingResponseDto } from './dto/booking-response.dto';
import { CreateBookingDto } from './dto/create-booking.dto';
import { PaginatedBookingsDto } from './dto/paginated-bookings.dto';
import { BookingStatus } from './entities/booking-status.enum';
import { Booking } from './entities/booking.entity';

// Allowed status moves; terminal states (CANCELLED, COMPLETED) have no exits.
const ALLOWED_TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  [BookingStatus.Pending]: [
    BookingStatus.Confirmed,
    BookingStatus.Completed,
    BookingStatus.Cancelled,
  ],
  [BookingStatus.Confirmed]: [BookingStatus.Completed, BookingStatus.Cancelled],
  [BookingStatus.Completed]: [],
  [BookingStatus.Cancelled]: [],
};

// Applies booking business rules over the booking and service repositories.
@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookings: Repository<Booking>,
    @InjectRepository(Service)
    private readonly services: Repository<Service>,
  ) {}

  // Validates the service, slot, and date before persisting a PENDING booking.
  async create(dto: CreateBookingDto): Promise<BookingResponseDto> {
    const service = await this.services.findOneBy({ id: dto.serviceId });
    if (!service) throw new NotFoundException('Service not found');
    if (!service.isActive) {
      throw new ConflictException('Service is not available for booking');
    }
    this.assertNotPast(dto.bookingDate, dto.bookingTime);
    await this.assertSlotFree(dto.serviceId, dto.bookingDate, dto.bookingTime);

    const booking = this.bookings.create({
      ...dto,
      notes: dto.notes ?? null,
      status: BookingStatus.Pending,
    });
    return this.toDto(await this.bookings.save(booking));
  }

  // Returns a filtered, newest-first page of bookings with its totals.
  async findAll(query: BookingQueryDto): Promise<PaginatedBookingsDto> {
    const [rows, total] = await this.bookings.findAndCount({
      where: this.buildWhere(query),
      order: { createdAt: 'DESC' },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
    return {
      items: rows.map((booking) => this.toDto(booking)),
      page: query.page,
      limit: query.limit,
      total,
    };
  }

  // Returns one booking or throws 404 when it is missing.
  async findOne(id: string): Promise<BookingResponseDto> {
    return this.toDto(await this.getEntity(id));
  }

  // Moves a booking to the target status when the transition is allowed.
  async updateStatus(
    id: string,
    status: BookingStatus,
  ): Promise<BookingResponseDto> {
    const booking = await this.getEntity(id);
    this.assertTransition(booking.status, status);
    booking.status = status;
    return this.toDto(await this.bookings.save(booking));
  }

  // Cancels a booking that is not already in a terminal state.
  async cancel(id: string): Promise<BookingResponseDto> {
    const booking = await this.getEntity(id);
    this.assertTransition(booking.status, BookingStatus.Cancelled);
    booking.status = BookingStatus.Cancelled;
    return this.toDto(await this.bookings.save(booking));
  }

  // Builds the status filter, expanding search into an OR over customer fields.
  private buildWhere(
    query: BookingQueryDto,
  ): FindOptionsWhere<Booking> | FindOptionsWhere<Booking>[] {
    const base: FindOptionsWhere<Booking> = {};
    if (query.status) base.status = query.status;

    const search = query.search?.trim();
    if (!search) return base;

    const like = ILike(`%${search}%`);
    return [
      { ...base, customerName: like },
      { ...base, customerEmail: like },
      { ...base, customerPhone: like },
    ];
  }

  // Loads a booking by id or throws the shared not-found error.
  private async getEntity(id: string): Promise<Booking> {
    const booking = await this.bookings.findOneBy({ id });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  // Rejects a slot already held by a non-cancelled booking as a conflict.
  private async assertSlotFree(
    serviceId: string,
    bookingDate: string,
    bookingTime: string,
  ): Promise<void> {
    const clash = await this.bookings.findOneBy({
      serviceId,
      bookingDate,
      bookingTime,
      status: Not(BookingStatus.Cancelled),
    });
    if (clash) {
      throw new ConflictException('That slot is already booked');
    }
  }

  // Rejects a booking whose date and time have already passed.
  private assertNotPast(bookingDate: string, bookingTime: string): void {
    const when = new Date(`${bookingDate}T${this.normalizeTime(bookingTime)}`);
    if (Number.isNaN(when.getTime()) || when.getTime() < Date.now()) {
      throw new BadRequestException('Booking date cannot be in the past');
    }
  }

  // Rejects a status move that is not permitted for the current state.
  private assertTransition(from: BookingStatus, to: BookingStatus): void {
    if (from === to || !ALLOWED_TRANSITIONS[from].includes(to)) {
      throw new ConflictException(
        `Cannot change booking status from ${from} to ${to}`,
      );
    }
  }

  // Pads HH:mm to HH:mm:ss so date parsing stays consistent.
  private normalizeTime(bookingTime: string): string {
    return bookingTime.length === 5 ? `${bookingTime}:00` : bookingTime;
  }

  // Converts a persistence entity to the API response shape.
  private toDto(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      serviceId: booking.serviceId,
      bookingDate: booking.bookingDate,
      bookingTime: booking.bookingTime,
      status: booking.status,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    };
  }
}
