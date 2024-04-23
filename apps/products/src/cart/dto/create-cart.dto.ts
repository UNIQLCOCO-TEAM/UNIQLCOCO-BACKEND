import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Status } from '../enum/status.enum';

export class CreateCartDto {
  @ApiProperty({
    name: 'status',
    enum: Status,
    default: Status.INACTIVE,
    required: true,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;

  @ApiProperty({
    name: 'products_id',
    default: new Array(0),
    required: true,
  })
  @IsArray()
  @IsNotEmpty()
  products_id: number[];

  @ApiProperty({
    name: 'uid',
    default: 1,
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  uid: number;
}
