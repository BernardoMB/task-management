import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe) // authCredentialsDto will be validated using decorators inside the AuthCredentialsDto
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  }

  // Alternatively
  /* @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(authCredentialsDto);
  } */

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentialsDto);
  }

  // Guarded endpoint

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
   * @param {*}
   * @memberof AuthController
   */
  @Post('/test')
  @UseGuards(AuthGuard())
  test(@Req() request: any) {
    console.log(request);
  }
}
