import { PartialType } from '@nestjs/swagger';
import { CreateOrderDto } from './create-order.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPositive, IsNumber, IsDate } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @ApiProperty({
    name: 'uid',
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  uid: number;

  @ApiProperty({
    name: 'cart_id',
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  cart_id: number;

  @ApiProperty({
    name: 'delivery_fee',
    example: '80',
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  delivery_fees: number;

  @ApiProperty({
    name: 'payment_type',
    example: '1',
    required: true,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  payment_type: number;

  @ApiProperty({
    name: 'time',
    example: '2024-04-10',
    required: true,
  })
  @IsNotEmpty()
  @IsDate()
  time: Date;
}
