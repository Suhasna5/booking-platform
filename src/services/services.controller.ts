import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceResponseDto } from './dto/service-response.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServicesService } from './services.service';

// JWT-protected CRUD routes for staff to manage service offerings.
@ApiTags('Services')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}
  // Creates a service offering.
  @Post() @ApiCreatedResponse({ type: ServiceResponseDto }) create(
    @Body() dto: CreateServiceDto,
  ) {
    return this.servicesService.create(dto);
  }
  // Lists all service offerings.
  @Get() @ApiOkResponse({ type: ServiceResponseDto, isArray: true }) findAll() {
    return this.servicesService.findAll();
  }
  // Gets one service offering.
  @Get(':id') @ApiOkResponse({ type: ServiceResponseDto }) findOne(
    @Param('id') id: string,
  ) {
    return this.servicesService.findOne(id);
  }
  // Updates a service offering.
  @Patch(':id') @ApiOkResponse({ type: ServiceResponseDto }) update(
    @Param('id') id: string,
    @Body() dto: UpdateServiceDto,
  ) {
    return this.servicesService.update(id, dto);
  }
  // Deletes a service offering.
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  remove(@Param('id') id: string) {
    return this.servicesService.remove(id);
  }
}
