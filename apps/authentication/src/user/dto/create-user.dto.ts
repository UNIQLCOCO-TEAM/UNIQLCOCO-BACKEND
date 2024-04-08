import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'John',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'First Name must has at least 2 characters.' })
  name: string;

  @ApiProperty({
    example: 'Doe',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Last Name must has at least 2 characters.' })
  surname: string;

  @ApiProperty({
    example: '2023-11-14T03:39:21.210Z',
    required: true,
  })
  @IsDateString()
  @IsNotEmpty()
  birth_date: Date;

  @ApiProperty({
    example: '0956732548',
    required: true,
  })
  @MinLength(10, { message: 'Phone number must contain 10 digits.' })
  @MaxLength(10, { message: 'Phone number must contain 10 digits.' })
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    example: '123/456 western.',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
