import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Applies the JWT strategy to endpoints that require an authenticated staff user.
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
