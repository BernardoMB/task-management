import { JwtStrategy } from './jwt.strategy';
import { Test } from '@nestjs/testing';

// The user repository is used in the JWT Strategy in order to inject the user object into the incoming request object.
// We dont want to use a database here for testing porpuses, so the user repository must be mocked.
const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe('JwtStrategy', () => {
  it('should pass', () => {
    expect(true).toEqual(true);
  });
});
