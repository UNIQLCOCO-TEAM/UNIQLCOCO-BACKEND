import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { UpdateInventory } from './dto/update-inventory.dto';
import * as fs from 'fs';
import * as path from 'path';
import { HttpService } from '@nestjs/axios';
import { promisify } from 'util';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly httpService: HttpService,
  ) {}

  async create(product: CreateProductDto, file: Express.Multer.File) {
    try {
      const pathParts = file.path.split('/');
      const filename = pathParts[pathParts.length - 1];

      const createProduct: Product = new Product();
      createProduct.title = product.title;
      createProduct.description = product.description;
      createProduct.color = product.color;
      createProduct.price = product.price;
      createProduct.type = product.product_type;
      createProduct.size = product.size;
      createProduct.inventory = product.inventory;
      createProduct.image_file = `/product/asset/${filename}`;

      const newProduct = await this.productRepository.save(createProduct);
      const newFilename = `product-${newProduct.id}.png`;
      newProduct.image_file = `/product/asset/${newFilename}`;

      fs.renameSync(file.path, path.join(file.destination, newFilename));

      const wavFile = `product-${newProduct.id}.wav`;

      newProduct.sound = `/product/sounds/${wavFile}`;
      await this.getSpeechDescription(newProduct.description, wavFile);

      return await this.productRepository.save(newProduct);
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  async getSpeechDescription(message: string, productId: string) {
    try {
      const fetchSpeechDescription = async (message: string) => {
        const urlPath: string = `https://api.aiforthai.in.th/vaja9/synth_audiovisual`;
        const apiKey: string = process.env.API_KEY || '';
        const headers = {
          Apikey: apiKey,
          'Content-Type': 'application/json',
        };
        const bodyData = {
          input_text: message,
          speaker: 1,
          phrase_break: 0,
          audiovisual: 0,
        };
        const result = await this.httpService.axiosRef.post(urlPath, bodyData, {
          headers: headers,
        });
        const res = {
          ...result.data,
        };
        return res.wav_url;
      };
      const wav_url = await fetchSpeechDescription(message);
      const fetchSound = async (wav_url: string, productId: string) => {
        const apiKey: string = process.env.API_KEY || '';
        const headers = {
          Apikey: apiKey,
        };
        const resp = await this.httpService.axiosRef.get(wav_url, {
          headers: headers,
          responseType: 'arraybuffer',
        });
        const location = './apps/products/src/product/sounds';
        const soundLocation = path.join(process.cwd(), location);
        if (resp.status === 200) {
          const writeFile = promisify(fs.writeFileSync);
          writeFile(`${soundLocation}/${productId}`, resp.data, 'binary');
        }
      };
      await fetchSound(wav_url, productId);
    } catch (err) {
      console.error(err);
    }
  }

  findAll() {
    return this.productRepository.find();
  }

  async findByTypeNonDuplicate(id: number) {
    const productsType: Product[] = await this.productRepository.find({
      where: {
        type: id,
      },
    });

    const nonDuplicationProductsType: Product[] = [];
    const productsName: string[] = [];

    for (const product of productsType) {
      if (!productsName.includes(product.title)) {
        productsName.push(product.title);
        nonDuplicationProductsType.push(product);
      }
    }

    return nonDuplicationProductsType;
  }

  async findById(id: number) {
    const product: Product = await this.productRepository.findOne({
      where: { id: id },
    });
    return await this.productRepository.find({
      where: {
        title: product.title,
      },
    });
  }

  findProductImage(imageName: string) {
    return `./apps/products/src/product/images/${imageName}`;
  }

  findSound(sound: string) {
    return `./apps/products/src/product/sounds/${sound}`;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    file: Express.Multer.File,
  ) {
    const newFilename = `product-${id}.png`;
    fs.renameSync(file.path, path.join(file.destination, newFilename));
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
    updateProduct.size =
      updateProductDto.size !== ''
        ? updateProductDto.size
        : (await this.productRepository.findOne({
            where: {
              id: id,
            },
          }))!.size;
    updateProduct.image_file = `/product/asset/${newFilename}`;
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

  async remove(id: number) {
    const product: Product = await this.productRepository.findOne({
      where: { id: id },
    });
    const pathParts = product.image_file.split('/');
    const filename = pathParts[pathParts.length - 1];
    const soundParts = product.sound.split('/');
    const soundFileName = soundParts[soundParts.length - 1];
    fs.rmSync(`./apps/products/src/product/images/${filename}`);
    fs.rmSync(`./apps/products/src/product/sounds/${soundFileName}`);
    await this.productRepository.delete(id);
    return product;
  }

  async findAllProductNotDuplicate() {
    const products: Product[] = await this.productRepository.find();
    const nonDuplicateProducts = {};

    products.forEach((product) => {
      const newProductFormat = {
        id: product.id,
        name: product.title,
        description: product.description,
        price: product.price,
        type: product.type === 1 ? 'shirt' : 'pants',
        color: product.color,
        path: product.image_file,
        inventory: {
          [product.size]: product.inventory,
        },
        sound: product.sound,
      };

      if (!nonDuplicateProducts[product.title]) {
        nonDuplicateProducts[product.title] = newProductFormat;
      } else {
        nonDuplicateProducts[product.title].inventory = {
          ...nonDuplicateProducts[product.title].inventory,
          [product.size]: product.inventory,
        };
      }
    });

    // Convert object values to an array
    const nonDuplicateProductsArray = Object.values(nonDuplicateProducts);

    return nonDuplicateProductsArray;
  }
}
