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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { multerOptions } from './config';
import { ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import * as fs from 'fs';
import { AuthGuard } from '../../../authentication/src/auth/guards/local.auth-guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '../../../authentication/src/auth/decorators/public.decorator';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiResponse({
    status: 201,
    description: 'OK.',
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
    return {
      status: 201,
      message: 'success',
      result: await this.productService.create(product, file),
    };
  }

  @Public()
  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('/asset/:imageName')
  async getNews(@Param('imageName') imageName: string, @Res() res) {
    const image = this.productService.findNewsImage(imageName);
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

  @ApiResponse({
    status: 200,
    description: 'OK.',
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

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Get('/type/:id')
  async findByType(@Param('id') id: string) {
    return {
      status: 200,
      message: 'success',
      result: await this.productService.findByType(+id),
    };
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
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
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Patch(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productService.update(+id, updateProductDto, file);
  }

  @ApiResponse({
    status: 200,
    description: 'OK.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
