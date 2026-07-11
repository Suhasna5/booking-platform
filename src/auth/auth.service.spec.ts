import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';

// Covers the credential rules that must hold independently of HTTP delivery.
describe('AuthService', () => {
  const userRepository = {
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  const jwtService = { signAsync: jest.fn() };
  const service = new AuthService(userRepository as never, jwtService as never);

  beforeEach(() => {
    jest.clearAllMocks();
    jwtService.signAsync.mockResolvedValue('access-token');
  });

  it('hashes a password before saving a new user', async () => {
    userRepository.findOneBy.mockResolvedValue(null);
    userRepository.create.mockImplementation((user) => user);
    userRepository.save.mockImplementation(async (user) => ({
      ...user,
      id: 'user-id',
    }));

    const result = await service.register({
      email: 'admin@example.com',
      password: 'secure-password',
    });

    expect(
      await bcrypt.compare(
        'secure-password',
        userRepository.save.mock.calls[0][0].passwordHash,
      ),
    ).toBe(true);
    expect(result).toEqual({ accessToken: 'access-token' });
  });

  it('rejects duplicate registration emails', async () => {
    userRepository.findOneBy.mockResolvedValue({ id: 'user-id' });

    await expect(
      service.register({
        email: 'admin@example.com',
        password: 'secure-password',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('rejects invalid login credentials', async () => {
    userRepository.findOneBy.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'admin@example.com',
        password: 'secure-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
