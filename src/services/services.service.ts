import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Service } from './entities/service.entity';

// Persists services and maps them to response DTOs for the controller.
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service) private readonly repository: Repository<Service>,
  ) {}

  // Stores price as fixed-scale numeric text and defaults isActive to true.
  async create(dto: CreateServiceDto): Promise<ServiceResponseDto> {
    return this.toDto(
      await this.repository.save(
        this.repository.create({
          ...dto,
          price: dto.price.toFixed(2),
          isActive: dto.isActive ?? true,
        }),
      ),
    );
  }

  // Returns every service as a response DTO.
  async findAll(): Promise<ServiceResponseDto[]> {
    return (await this.repository.find()).map((service) => this.toDto(service));
  }

  // Returns one service or throws 404 when it is missing.
  async findOne(id: string): Promise<ServiceResponseDto> {
    return this.toDto(await this.getEntity(id));
  }

  // Applies only supplied fields, re-formatting price when it changes.
  async update(id: string, dto: UpdateServiceDto): Promise<ServiceResponseDto> {
    const service = await this.getEntity(id);
    Object.assign(service, {
      ...dto,
      ...(dto.price !== undefined ? { price: dto.price.toFixed(2) } : {}),
    });
    return this.toDto(await this.repository.save(service));
  }

  // Deletes an existing service, 404 when it is missing.
  async remove(id: string): Promise<void> {
    await this.repository.remove(await this.getEntity(id));
  }

  // Loads an entity by id or throws the shared not-found error.
  private async getEntity(id: string): Promise<Service> {
    const service = await this.repository.findOneBy({ id });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  // Converts a persistence entity to the numeric-price response shape.
  private toDto(service: Service): ServiceResponseDto {
    return {
      id: service.id,
      title: service.title,
      description: service.description,
      duration: service.duration,
      price: Number(service.price),
      isActive: service.isActive,
    };
  }
}
