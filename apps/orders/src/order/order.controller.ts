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
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../../../authentication/src/auth/decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiResponse({
    status: 201,
    description: 'Success.',
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

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
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
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @Get('/uid/:uid')
  async findByUid(@Param('uid') uid: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.findByUid(+uid),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
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

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @Post('/totalUser')
  async getTotalUser() {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.getTotalUser(),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.remove(+id),
    };
  }

  @ApiResponse({
    status: 201,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @ApiTags('dashboard')
  @Post('/topSeller')
  async getTopSeller() {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.getTopSeller(),
    };
  }

  @ApiResponse({
    status: 201,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @ApiTags('dashboard')
  @Post('/overview')
  async getStatsOverview() {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.getStatsOverview(),
    };
  }

  @ApiResponse({
    status: 201,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @ApiTags('dashboard')
  @Post('/income')
  async getTotalInComePerMonth() {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.getTotalInComePerMonth(),
    };
  }

  @Public()
  @ApiResponse({
    status: 201,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiTags('dashboard')
  @Post('/popular')
  async getPopularProduct() {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.getPopularProduct(),
    };
  }

  @Public()
  @ApiResponse({
    status: 201,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiTags('dashboard')
  @Post('/topSellerForDashboard')
  async getTopSellerForDashboard() {
    return {
      status: 200,
      message: 'success',
      result: await this.orderService.getTopSellerForDashboard(),
    };
  }
}
