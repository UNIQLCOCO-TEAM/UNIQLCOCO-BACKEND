import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(product: CreateProductDto, file: Express.Multer.File) {
    const pathParts = file.path.split('/');
    const filename = pathParts[pathParts.length - 1];

    const createProduct: Product = new Product();
    createProduct.title = product.title;
    createProduct.description = product.description;
    createProduct.color = product.color;
    createProduct.price = product.price;
    createProduct.type = product.type;
    createProduct.image_file = `/product/asset/${filename}`;

    return this.productRepository.save(createProduct);
  }

  findAll() {
    return this.productRepository.find();
  }

  findByType(id: number) {
    return this.productRepository.find({
      where: {
        type: id,
      },
    });
  }

  findById(id: number) {
    return this.productRepository.find({
      where: {
        id: id,
      },
    });
  }

  findNewsImage(imageName: string) {
    return `./apps/auth/src/news/images/${imageName}`;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File,
  ) {
    const pathParts = file.path.split('/');
    const filename = pathParts[pathParts.length - 1];
    const updateProduct = new Product();
    updateProduct.id = id;
    updateProduct.title =
      updateProductDto.title !== ''
        ? updateProductDto.title
        : (await this.productRepository.findOne({
            where: {
              id: id,
            },
          }))!.title;
    updateProduct.description =
      updateProductDto.description !== ''
        ? updateProductDto.description
        : (await this.productRepository.findOne({
            where: {
              id: id,
            },
          }))!.description;
    updateProduct.color =
      updateProductDto.color !== ''
        ? updateProductDto.color
        : (await this.productRepository.findOne({
            where: {
              id: id,
            },
          }))!.color;
    updateProduct.price =
      updateProductDto.price !== 0
        ? updateProductDto.price
        : (await this.productRepository.findOne({
            where: {
              id: id,
            },
          }))!.price;
    updateProduct.type =
      updateProductDto.type !== 0
        ? updateProductDto.type
        : (await this.productRepository.findOne({
            where: {
              id: id,
            },
          }))!.type;
    updateProduct.image_file = `/product/asset/${filename}`;
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
