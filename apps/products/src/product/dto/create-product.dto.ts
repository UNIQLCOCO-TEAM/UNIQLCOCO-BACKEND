import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: 'string', required: false })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ type: 'string', required: false })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ type: 'string', required: false })
  @IsNumber()
  @IsNotEmpty()
  type: number;

  @ApiProperty({ type: 'string', format: 'binary', required: true })
  image_file: Express.Multer.File;
}
