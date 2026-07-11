import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

// Defines a service offering managed by authenticated staff.
export class CreateServiceDto {
  @ApiProperty() @IsString() @MinLength(1) title!: string;
  @ApiProperty() @IsString() @MinLength(1) description!: string;
  @ApiProperty() @IsNumber() @Min(1) duration!: number;
  @ApiProperty() @IsNumber() @Min(0) price!: number;
  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
