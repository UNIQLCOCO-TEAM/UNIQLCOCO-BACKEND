import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'เสื้อคอกลมผู้ชายผ้าถัก',
    required: true,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example:
      'ทรงเข้ารูป ปลายขาเรียว, ซักนุ่ม, ยืดได้ 2 ทิศทาง และน้ำหนักเบา สวมใส่สบาย',
    required: true,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 'สีฟ้าท๊อปดราย',
    required: true,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({
    example: '200',
    required: true,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    example: 'S, M, L, XL',
    required: true,
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty({
    example: '1',
    required: true,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  product_type: number;

  @ApiProperty({
    example: '100',
    required: true,
    type: 'number',
  })
  @IsNumber()
  @IsNotEmpty()
  inventory: number;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  file: Express.Multer.File;
}
