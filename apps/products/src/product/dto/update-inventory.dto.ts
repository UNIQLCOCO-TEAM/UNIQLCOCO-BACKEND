import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateInventory {
  @ApiProperty({
    name: 'inventory',
    example: '100',
    required: true,
  })
  @IsNumber()
  @IsNotEmpty()
  inventory: number;
}
