import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    example: 'dev@local.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'P@ssw0rd',
    required: true,
  })
  @IsStrongPassword()
  password: string;
}
