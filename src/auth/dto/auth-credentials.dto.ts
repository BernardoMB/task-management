import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class AuthCredentialsDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  @IsNotEmpty()
  @IsOptional()
  username: string;
  @IsString()
  @MinLength(5)
  @MaxLength(30)
  @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(8)
  @MaxLength(30)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    // Error message to diaplay if password doe snot match the regular expression.
    message:
      'Password must contain special characters, upper case and lower case letters',
  })
  @IsNotEmpty()
  password: string;
}
