import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DeepPartial, FindManyOptions, FindOptionsWhere } from 'typeorm';
import { BookingsService } from './bookings.service';
import { BookingStatus } from './entities/booking-status.enum';
import { Booking } from './entities/booking.entity';
import { Service } from './entities/service.entity';

// Covers the booking rules that must hold independently of HTTP delivery.
describe('BookingsService', () => {
  const bookings = {
    create: jest.fn<Booking, [DeepPartial<Booking>]>(),
    save: jest.fn<Promise<Booking>, [Booking]>(),
    find: jest.fn<Promise<Booking[]>, []>(),
    findAndCount: jest.fn<
      Promise<[Booking[], number]>,
      [FindManyOptions<Booking>]
    >(),
    findOneBy: jest.fn<Promise<Booking | null>, [FindOptionsWhere<Booking>]>(),
  };
  const services = { findOneBy: jest.fn() };
  const service = new BookingsService(bookings as never, services as never);

  const activeService: Partial<Service> = { id: 'service-id', isActive: true };
  const futureDate = '2999-01-01';

  const baseDto = {
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    customerPhone: '+1-555-0100',
    serviceId: 'service-id',
    bookingDate: futureDate,
    bookingTime: '14:30',
  };

  beforeEach(() => jest.clearAllMocks());

  it('rejects booking a missing service', async () => {
    services.findOneBy.mockResolvedValue(null);

    await expect(service.create(baseDto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('rejects booking an inactive service', async () => {
    services.findOneBy.mockResolvedValue({ id: 'service-id', isActive: false });

    await expect(service.create(baseDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('rejects a past booking date', async () => {
    services.findOneBy.mockResolvedValue(activeService);

    await expect(
      service.create({ ...baseDto, bookingDate: '2000-01-01' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a duplicate active slot', async () => {
    services.findOneBy.mockResolvedValue(activeService);
    bookings.findOneBy.mockResolvedValue({ id: 'existing' });

    await expect(service.create(baseDto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('persists a new booking as PENDING', async () => {
    services.findOneBy.mockResolvedValue(activeService);
    bookings.findOneBy.mockResolvedValue(null);
    bookings.create.mockImplementation((input) => input as Booking);
    bookings.save.mockImplementation((input) =>
      Promise.resolve({
        ...input,
        id: 'booking-id',
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const result = await service.create(baseDto);

    expect(bookings.create.mock.calls[0]?.[0]?.status).toBe(
      BookingStatus.Pending,
    );
    expect(result.status).toBe(BookingStatus.Pending);
  });

  it('rejects moving a cancelled booking to completed', async () => {
    bookings.findOneBy.mockResolvedValue({
      id: 'booking-id',
      status: BookingStatus.Cancelled,
    });

    await expect(
      service.updateStatus('booking-id', BookingStatus.Completed),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('cancels a non-cancelled booking', async () => {
    bookings.findOneBy.mockResolvedValue({
      id: 'booking-id',
      status: BookingStatus.Pending,
    });
    bookings.save.mockImplementation((input) => Promise.resolve(input));

    const result = await service.cancel('booking-id');

    expect(result.status).toBe(BookingStatus.Cancelled);
  });

  it('rejects cancelling an already cancelled booking', async () => {
    bookings.findOneBy.mockResolvedValue({
      id: 'booking-id',
      status: BookingStatus.Cancelled,
    });

    await expect(service.cancel('booking-id')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('paginates with skip, take, and totals', async () => {
    bookings.findAndCount.mockResolvedValue([[], 42]);

    const result = await service.findAll({ page: 3, limit: 10 });

    const options = bookings.findAndCount.mock.calls[0]?.[0];
    expect(options?.skip).toBe(20);
    expect(options?.take).toBe(10);
    expect(result).toEqual({ items: [], page: 3, limit: 10, total: 42 });
  });

  it('expands search into an OR over customer fields with the status filter', async () => {
    bookings.findAndCount.mockResolvedValue([[], 0]);

    await service.findAll({
      page: 1,
      limit: 20,
      search: 'jane',
      status: BookingStatus.Pending,
    });

    const where = bookings.findAndCount.mock.calls[0]?.[0]?.where;
    expect(Array.isArray(where)).toBe(true);
    expect(where).toHaveLength(3);
    expect(where?.[0]).toEqual(
      expect.objectContaining({ status: BookingStatus.Pending }),
    );
  });
});
