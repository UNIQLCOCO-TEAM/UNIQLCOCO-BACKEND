import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {
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
    example: '2023-11-14',
    required: true,
  })
  @IsDate()
  @IsNotEmpty()
  birth_date: Date;

  @ApiProperty({
    example: '0956732548',
    required: true,
  })
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
