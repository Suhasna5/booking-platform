import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test } from '@nestjs/testing';
import { Server } from 'node:http';
import request from 'supertest';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { BookingsController } from '../src/bookings/bookings.controller';
import { BookingsService } from '../src/bookings/bookings.service';
import { BookingStatus } from '../src/bookings/entities/booking-status.enum';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { createValidationException } from '../src/common/validation/validation-exception.factory';
import { ServicesController } from '../src/services/services.controller';
import { ServicesService } from '../src/services/services.service';

// Smoke-tests public booking creation and JWT protection without a live database.
describe('Booking smoke (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let token: string;

  const bookingsService = { create: jest.fn() };
  const servicesService = { findAll: jest.fn() };

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    process.env.JWT_EXPIRES_IN = '1h';

    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        PassportModule,
        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            secret: config.getOrThrow<string>('JWT_SECRET'),
          }),
        }),
      ],
      controllers: [BookingsController, ServicesController],
      providers: [
        JwtStrategy,
        JwtAuthGuard,
        { provide: BookingsService, useValue: bookingsService },
        { provide: ServicesService, useValue: servicesService },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        exceptionFactory: createValidationException,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
    server = app.getHttpServer() as Server;

    token = app
      .get(JwtService)
      .sign({ sub: 'user-id', email: 'admin@example.com' });
  });

  afterAll(async () => {
    await app.close();
  });

  it('creates a booking without authentication', async () => {
    bookingsService.create.mockResolvedValue({
      id: 'booking-id',
      status: BookingStatus.Pending,
    });

    await request(server)
      .post('/api/bookings')
      .send({
        customerName: 'Jane Doe',
        customerEmail: 'jane@example.com',
        customerPhone: '+1-555-0100',
        serviceId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        bookingDate: '2999-01-01',
        bookingTime: '14:30',
      })
      .expect(201);

    expect(bookingsService.create).toHaveBeenCalled();
  });

  it('rejects unauthenticated access to service routes', async () => {
    await request(server).get('/api/services').expect(401);
  });

  it('allows service routes with a valid token', async () => {
    servicesService.findAll.mockResolvedValue([]);

    await request(server)
      .get('/api/services')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(servicesService.findAll).toHaveBeenCalled();
  });
});
