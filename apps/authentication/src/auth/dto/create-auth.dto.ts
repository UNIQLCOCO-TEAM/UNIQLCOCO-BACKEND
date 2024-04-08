import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsStrongPassword,
} from 'class-validator';

export class CreateAccountWithEmailDto {
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

  @ApiProperty({
    example: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  uid: number;
}
