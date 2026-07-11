import { PartialType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';

// Allows staff to change any supplied service fields.
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
