import { NotFoundException } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { ServicesService } from './services.service';
import { Service } from './entities/service.entity';

// Covers the service-management rules that must hold independently of HTTP delivery.
describe('ServicesService', () => {
  const repository = {
    create: jest.fn<Service, [DeepPartial<Service>]>(),
    save: jest.fn<Promise<Service>, [Service]>(),
    find: jest.fn<Promise<Service[]>, []>(),
    findOneBy: jest.fn<Promise<Service | null>, [Partial<Service>]>(),
    remove: jest.fn<Promise<Service>, [Service]>(),
  };
  const service = new ServicesService(repository as never);

  const entity: Service = {
    id: 'service-id',
    title: 'Haircut',
    description: 'Standard haircut',
    duration: 30,
    price: '25.00',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    bookings: [],
  };

  beforeEach(() => jest.clearAllMocks());

  it('defaults isActive to true when omitted on create', async () => {
    repository.create.mockImplementation((input) => input as Service);
    repository.save.mockResolvedValue(entity);

    const result = await service.create({
      title: 'Haircut',
      description: 'Standard haircut',
      duration: 30,
      price: 25,
    });

    const created = repository.create.mock.calls[0]?.[0];
    expect(created?.isActive).toBe(true);
    expect(created?.price).toBe('25.00');
    expect(result).toEqual({
      id: 'service-id',
      title: 'Haircut',
      description: 'Standard haircut',
      duration: 30,
      price: 25,
      isActive: true,
    });
  });

  it('throws NotFoundException when a service is missing', async () => {
    repository.findOneBy.mockResolvedValue(null);

    await expect(service.findOne('missing-id')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('applies supplied fields on update', async () => {
    repository.findOneBy.mockResolvedValue({ ...entity });
    repository.save.mockImplementation((input) => Promise.resolve(input));

    const result = await service.update('service-id', { price: 40 });

    const saved = repository.save.mock.calls[0]?.[0];
    expect(saved?.price).toBe('40.00');
    expect(result.price).toBe(40);
  });

  it('removes an existing service', async () => {
    repository.findOneBy.mockResolvedValue({ ...entity });
    repository.remove.mockResolvedValue(entity);

    await service.remove('service-id');

    expect(repository.remove).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'service-id' }),
    );
  });
});
