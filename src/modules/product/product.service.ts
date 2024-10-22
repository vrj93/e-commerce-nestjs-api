import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entity/product.entity';
import { Brackets, Repository } from 'typeorm';
import { Category } from '../../entity/category.entity';
import { Brand } from '../../entity/brand.entity';
import { Color } from '../../entity/color.entity';
import getImageS3 from '../../utils/getImageS3';

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
    if (!req.search) {
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
        name: `${req.search}`,
      });

    if (
      (req.brands && req.brands.length) ||
      (req.categories && req.categories.length) ||
      req.colorId
    ) {
      productObj.andWhere(
        new Brackets((qb) => {
          if (req.categories && req.categories.length) {
            qb.where('category.slug IN (:...categories)', {
              categories: req.categories,
            });
          }
          if (req.brands && req.brands.length) {
            qb.andWhere('brand.slug IN (:...brands)', {
              brands: req.brands,
            });
          }
          if (req.colors && req.colors.length) {
            qb.andWhere('color.name IN (:...colors)', {
              colors: req.colors,
            });
          }
        }),
      );
    }

    const selectedCategories = [];
    const products = await productObj.getMany();

    for (const product of products) {
      if (product.image) {
        const images = JSON.parse(product.image);
        delete product.image;
        product.image = await getImageS3(images.images);
      }
      if (product.category) {
        selectedCategories.push(product.category.id);
      }
    }

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Product fetched successfully',
      data: products,
    };
  }

  async getCategory(): Promise<any> {
    const res = await this.categoryRepository.find({
      select: ['name', 'slug'],
    });
    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Categories fetched successfully!',
      data: res,
    };
  }

  async getBrand(): Promise<any> {
    const res = await this.brandRepository.find({
      select: ['name', 'slug'],
    });
    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Categories fetched successfully!',
      data: res,
    };
  }

  async getColor(): Promise<any> {
    const res = await this.colorRepository.find({
      select: ['name'],
    });
    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Categories fetched successfully!',
      data: res,
    };
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
      product.image = await getImageS3(imageObj.images);
    }

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Product fetched successfully',
      data: product,
    };
  }
}
