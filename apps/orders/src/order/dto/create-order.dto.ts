import {
  IsNotEmpty,
  IsArray,
  IsPositive,
  IsInt,
  IsDateString,
} from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  uid: number;

  @IsNotEmpty()
  @IsArray()
  products: number[];

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  delivery_type: number;

  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  payment_type: number;

  @IsNotEmpty()
  @IsDateString()
  time: Date;
}
