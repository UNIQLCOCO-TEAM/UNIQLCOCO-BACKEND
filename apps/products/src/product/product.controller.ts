import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { multerOptions } from './config';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import * as fs from 'fs';
import { AuthGuard } from '../../../authentication/src/auth/guards/local.auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../../../authentication/src/auth/decorators/public.decorator';
import { UpdateInventory } from './dto/update-inventory.dto';
import { Roles } from '../../../authentication/src/auth/decorators/roles.decorator';
import { Role } from '../../../authentication/src/auth/enum/role.enum';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.Admin)
  @ApiResponse({
    status: 201,
    description: 'Success.',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden.',
  })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(
    @Body() product: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      return {
        status: 201,
        message: 'success',
        result: await this.productService.create(product, file),
      };
    } catch (err) {
      console.log(err);
      throw new BadRequestException(err);
    }
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiTags('asset')
  @Get('/asset/:imageName')
  async getProductImage(@Param('imageName') imageName: string, @Res() res) {
    const image = this.productService.findProductImage(imageName);
    try {
      // Check if the image file exists
      if (fs.existsSync(image)) {
        // Set the appropriate content type for the image
        res.setHeader('Content-Type', 'image/jpeg');

        // Read the image file and send it as the response
        fs.createReadStream(image).pipe(res);
      } else {
        // If the image file does not exist, return a 404 error
        res.status(HttpStatus.NOT_FOUND).send('Image not found');
      }
    } catch (error) {
      // Handle other errors, if any
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiTags('asset')
  @Get('/sounds/:sound')
  async getSound(@Param('sound') sound: string, @Res() res) {
    const sounds = this.productService.findSound(sound);
    try {
      if (fs.existsSync(sounds)) {
        res.setHeader('Content-Type', 'audio/wav');
        fs.createReadStream(sounds).pipe(res);
      } else {
        res.status(HttpStatus.NOT_FOUND).send('Audio not found');
      }
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Internal Server Error');
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get()
  async findAll() {
    return {
      status: 200,
      message: 'success',
      result: await this.productService.findAll(),
    };
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiTags('category')
  @Get('/type/:id')
  async findByType(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.productService.findByTypeNonDuplicate(+id),
    };
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get(':id')
  async findByID(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.productService.findById(+id),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return {
      status: 200,
      message: 'success',
      result: await this.productService.update(+id, updateProductDto, file),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @ApiTags('category')
  @Patch('/inventory/update/:id')
  async updateInventory(
    @Param('id') id: number,
    @Body() updateData: UpdateInventory,
  ) {
    try {
      const updateInventory = await this.productService.updateInventory(
        id,
        updateData,
      );
      return {
        status: 200,
        message: 'success',
        result: updateInventory,
      };
    } catch (err) {
      throw new BadRequestException(err);
    }
  }

  @ApiResponse({
    status: 200,
    description: 'Success.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.productService.remove(+id),
    };
  }
}
