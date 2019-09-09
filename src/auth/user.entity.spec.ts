import { User } from './user.entity';
import * as bycrypt from 'bcryptjs';

// When testing the user entity, we should treat the user as a plain class.
// We dont need a mock module here becuase the user entity can be tested independently.
// The only thing that we can test here is the validate password mathod.
describe('User entity', () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'testSalt';
    bycrypt.hash = jest.fn();
  });

  describe('validatePassword', () => {
    it('should validate user password succesfully', async () => {
      bycrypt.hash.mockReturnValue('testPassword');
      expect(bycrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('hahahaloqueseaxdxdx666');
      expect(bycrypt.hash).toHaveBeenCalledWith(
        'hahahaloqueseaxdxdx666',
        'testSalt',
      );
      expect(result).toEqual(true);
    });

    it('should fail to validate user password', async () => {
      bycrypt.hash.mockReturnValue('wrongPassword');
      expect(bycrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrongPassword');
      expect(bycrypt.hash).toHaveBeenCalledWith('wrongPassword', 'testSalt');
      expect(result).toEqual(false);
    });
  });
});
