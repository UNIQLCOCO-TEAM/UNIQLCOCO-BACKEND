import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateInventory } from './dto/update-inventory.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(product: CreateProductDto, file: Express.Multer.File) {
    try {
      const pathParts = file.path.split('/');
      const filename = pathParts[pathParts.length - 1];

      const createProduct: Product = new Product();
      createProduct.title = product.title;
      createProduct.description = product.description;
      createProduct.color = product.color;
      createProduct.price = product.price;
      createProduct.type = product.product_type;
      createProduct.inventory = product.inventory;
      createProduct.image_file = `/product/asset/${filename}`;

      return this.productRepository.save(createProduct);
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
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
    return `./apps/products/src/product/images/${imageName}`;
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
      updateProductDto.product_type !== 0
        ? updateProductDto.product_type
        : (await this.productRepository.findOne({
            where: {
              id: id,
            },
          }))!.type;
    updateProduct.inventory =
      updateProductDto.inventory !== 0
        ? updateProductDto.inventory
        : (await this.productRepository.findOne({
            where: {
              id: id,
            },
          }))!.inventory;
    updateProduct.image_file = `/product/asset/${filename}`;
    return this.productRepository.save(updateProduct);
  }

  async updateInventory(id: number, updateData: UpdateInventory) {
    const product: Product = await this.productRepository.findOne({
      where: { id: id },
    });
    const updateProduct: Product = {
      ...product,
      inventory: updateData.inventory,
    };
    return this.productRepository.save(updateProduct);
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
