import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Brackets, Repository } from 'typeorm';
import { Category } from '../entity/category.entity';
import { Brand } from '../entity/brand.entity';
import { Color } from '../entity/color.entity';
import { S3 } from 'aws-sdk';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
  ) {}

  async filter(req: any): Promise<any> {
    if (!req.name) {
      return {
        flag: false,
        status: HttpStatus.BAD_REQUEST,
        msg: 'Please enter product name',
      };
    }

    const productObj = this.productRepository.createQueryBuilder('product');
    productObj
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.colors', 'color')
      .where('MATCH(product.name) AGAINST (:name)', {
        name: `${req.name}`,
      });

    if (req.brandId || req.categoryId || req.colorId) {
      productObj.andWhere(
        new Brackets((qb) => {
          if (req.brandId) {
            qb.where('brand.id IN (:...brandId)', {
              brandId: req.brandId,
            });
          }
          if (req.categoryId) {
            qb.orWhere('category.id IN (:...categoryId)', {
              categoryId: req.categoryId,
            });
          }
          if (req.colorId) {
            qb.orWhere('color.id IN (:...colorId)', {
              colorId: req.colorId,
            });
          }
        }),
      );
    }
    const products = await productObj.getMany();

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Product fetched successfully',
      data: products,
    };
  }

  async getCategory(): Promise<any> {
    return await this.categoryRepository.find();
  }

  async getBrand(): Promise<any> {
    return await this.brandRepository.find();
  }

  async getColor(): Promise<any> {
    return await this.colorRepository.find();
  }

  async getProduct(productId: any): Promise<any> {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.colors', 'color')
      .where({ id: productId })
      .getOne();

    const imageObj = JSON.parse(product.image);
    if (imageObj) {
      delete product.image;
      product.image = await this.getImageS3(imageObj.images);
    }

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Product fetched successfully',
      data: product,
    };
  }

  async getImageS3(images: any): Promise<any> {
    const region = process.env.AWS_BUCKET_REGION;
    const accessKey = process.env.AWS_ACCESS_KEY;
    const secretKey = process.env.AWS_SECRET_KEY;

    try {
      const s3 = new S3({
        region: region,
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      });

      const imageUrl = [];
      for (const image of images) {
        const params = {
          Bucket: 'e-commerce-nestjs-images',
          Key: `product/${image}`,
        };
        imageUrl.push(await s3.getSignedUrlPromise('getObject', params));
      }
      return imageUrl;
    } catch (err) {
      throw new Error(err);
    }
  }
}
