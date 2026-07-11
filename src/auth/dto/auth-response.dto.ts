import { ApiProperty } from '@nestjs/swagger';

// Returns the access token issued after successful authentication.
export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;
}
