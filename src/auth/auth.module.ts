import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// Groups authentication delivery and application services.
@Module({
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
