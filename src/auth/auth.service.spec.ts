import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { DeepPartial, FindOptionsWhere } from 'typeorm';
import { AuthService } from './auth.service';
import { User } from './user.entity';

// Covers the credential rules that must hold independently of HTTP delivery.
describe('AuthService', () => {
  const userRepository = {
    findOneBy: jest.fn<Promise<User | null>, [FindOptionsWhere<User>]>(),
    create: jest.fn<User, [DeepPartial<User>]>(),
    save: jest.fn<Promise<User>, [User]>(),
  };
  const jwtService = { signAsync: jest.fn() };
  const service = new AuthService(userRepository as never, jwtService as never);

  beforeEach(() => {
    jest.clearAllMocks();
    jwtService.signAsync.mockResolvedValue('access-token');
  });

  it('hashes a password before saving a new user', async () => {
    userRepository.findOneBy.mockResolvedValue(null);
    userRepository.create.mockImplementation((user) => user as User);
    userRepository.save.mockImplementation((user) =>
      Promise.resolve({ ...user, id: 'user-id' }),
    );

    const result = await service.register({
      email: 'admin@example.com',
      password: 'secure-password',
    });

    const savedUser = userRepository.save.mock.calls[0]?.[0];

    expect(savedUser).toBeDefined();
    expect(
      await bcrypt.compare('secure-password', savedUser.passwordHash),
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
