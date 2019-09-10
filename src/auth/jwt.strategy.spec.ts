import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UnauthorizedException } from '@nestjs/common';

// The user repository is used in the JWT Strategy in order to inject the user object into the incoming request object.
// We dont want to use a database here for testing porpuses, so the user repository must be mocked.
const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository; // Not defining type here because the repository is mocked.

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        // Here we'll use a mock user repository.
        { provide: UserRepository, useFactory: mockUserRepository }
      ]
    }).compile();
    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe('validate', () => {
    it('validates and returns the user based on JWT payload', async () => {
      const user = new User();
      user.username = 'TestUser';
      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: 'TestUser' });
      expect(userRepository.findOne).toHaveBeenCalledWith({ username: 'TestUser' });
      expect(result).toEqual(user);
    });
    it('throws an unauthorized exception as user cannot be found', () => {
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: 'TestUser' })).rejects.toThrow(UnauthorizedException);
    });
  });

});
