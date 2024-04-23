import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '../../../authentication/src/auth/guards/local.auth-guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateStatus } from './dto/update-status.dto';

@UseGuards(AuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

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
  async create(@Body() createCartDto: CreateCartDto) {
    return {
      status: 201,
      message: 'success',
      result: await this.cartService.create(createCartDto),
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
      result: await this.cartService.findAll(),
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
      result: await this.cartService.findOne(+id),
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
  @Get('/uid/:id')
  async findUIDActiveCart(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.cartService.findUIDActiveCart(+id),
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
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    return {
      status: 200,
      message: 'success',
      result: this.cartService.update(+id, updateCartDto),
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
  @ApiTags('status')
  @Patch('/status/:id')
  updateCartStatus(
    @Param('id') id: string,
    @Body() updateStatus: UpdateStatus,
  ) {
    return {
      status: 200,
      message: 'success',
      result: this.cartService.updateCartStatus(+id, updateStatus),
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
  remove(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: this.cartService.remove(+id),
    };
  }
}
