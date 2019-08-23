import { createParamDecorator } from '@nestjs/common';
import { User } from '../user.entity';

export const GetUser = createParamDecorator(
  (data, request): User => {
    return request.user;
  },
);
