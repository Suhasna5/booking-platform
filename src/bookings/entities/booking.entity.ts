import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Service } from '../../services/entities/service.entity';
import { BookingStatus } from './booking-status.enum';

@Index('IDX_bookings_status', ['status'])
@Index('IDX_bookings_created_at', ['createdAt'])
@Index('IDX_bookings_service_date_time', [
  'serviceId',
  'bookingDate',
  'bookingTime',
])
// Persists a customer's requested time slot for a service.
@Entity({ name: 'bookings' })
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'customer_name', type: 'varchar', length: 150 })
  customerName!: string;

  @Column({ name: 'customer_email', type: 'varchar', length: 254 })
  customerEmail!: string;

  @Column({ name: 'customer_phone', type: 'varchar', length: 30 })
  customerPhone!: string;

  @Column({ name: 'service_id', type: 'uuid' })
  serviceId!: string;

  @ManyToOne(() => Service, (service) => service.bookings, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'service_id' })
  service!: Service;

  @Column({ name: 'booking_date', type: 'date' })
  bookingDate!: string;

  @Column({ name: 'booking_time', type: 'time' })
  bookingTime!: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    enumName: 'booking_status',
    default: BookingStatus.Pending,
  })
  status!: BookingStatus;

  @Column({ type: 'text', nullable: true })
  notes!: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
