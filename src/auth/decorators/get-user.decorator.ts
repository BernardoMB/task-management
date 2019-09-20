import { createParamDecorator } from '@nestjs/common';
import { User } from '../user.entity';

/**
 * This decorator is used to get que user object
 * from the request and insert it into the request
 * handler method (Get, Post, etc.)
 */
export const GetUser = createParamDecorator(
  (data, request): User => {
    return request.user;
  },
);
