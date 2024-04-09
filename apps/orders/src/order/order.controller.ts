import {
  Controller,
  Get,
  Post,
  Body,
  // Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
// import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from '../../../authentication/src/auth/guards/local.auth-guard';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiResponse({
    status: 201,
    description: 'OK.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    return {
      status: 201,
      message: 'success',
      result: await this.orderService.create(createOrderDto),
    };
  }

  @Get()
  async findAll() {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.findAll(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.findOne(+id),
    };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
  //   return this.orderService.update(+id, updateOrderDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.remove(+id),
    };
  }
}
