import { ApiProperty } from '@nestjs/swagger';

// Exposes service data without leaking the persistence entity.
export class ServiceResponseDto {
  @ApiProperty() id!: string;
  @ApiProperty() title!: string;
  @ApiProperty() description!: string;
  @ApiProperty() duration!: number;
  @ApiProperty() price!: number;
  @ApiProperty() isActive!: boolean;
}
