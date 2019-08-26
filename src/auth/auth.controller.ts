import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  /**
   * Creates an instance of AuthController.
   * @param {AuthService} authService
   * @memberof AuthController
   */
  constructor(private authService: AuthService) {}

  /**
   * This method is decorated with the @UsePipes() decorator passing
   * the ValidationPipe so the authCredentialsDto object will be
   * validated using decorators inside the AuthCredentialsDto class.
   * The @Body() decorator inside the method's signature indicates that
   * the hole body of the request must be of type AuthCredentialsDto.
   *
   * @param {AuthCredentialsDto} authCredentialsDto
   * @returns {Promise<void>}
   * @memberof AuthController
   */
  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  /**
   * The @Body() decorator inside the method's signature indicates that
   * the hole body of the request must be of type AuthCredentialsDto
   * and it must be validated using the decorators declared in the
   * AuthCredentialsDto class.
   *
   * @param {AuthCredentialsDto} authCredentialsDto
   * @returns {Promise<{ accessToken: string }>}
   * @memberof AuthController
   */
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  /**
   * This is a guarded endpoint. Because of the AuthGuard,
   * the function will automaticallyt extract the access token
   * from the Authorization header of the incoming request.
   * If the access token is invalid, the AuthGuard will automatically
   * rejects the request sending an unathorized request status.
   * If the the request provided a valid access token, the AuthGuard
   * will inject the user object into que request object
   * The @Req() decorator gives acces to the complete request object.
   *
   * @param {*} request The entire request object.
   * @memberof AuthController
   */
  @Post('/test1')
  @UseGuards(AuthGuard())
  test1(@Req() request: any) {
    // At this point, the request object will contain the user
    // thanks to the validate() method inside the JwtStrategy class.
    // Note: the validate() method gets executed for this endpoint
    // because it is decorayed with @UseGuards(AuthGuard()).
    console.log(request);
  }

  /**
   * Using the @GetUser() decorator to extract the user
   * that is injected in the request via the AuthGuard.
   *
   * @param {*} request
   * @memberof AuthController
   */
  @Post('/test2')
  @UseGuards(AuthGuard())
  test2(@GetUser() user: User) {
    console.log(user);
  }
}
