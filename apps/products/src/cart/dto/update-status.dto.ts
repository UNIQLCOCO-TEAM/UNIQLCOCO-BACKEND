import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Status } from '../enum/status.enum';

export class UpdateStatus {
  @ApiProperty({
    name: 'status',
    enum: Status,
    default: Status.INACTIVE,
    required: true,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: Status;
}
