import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../entity/product.entity';
import { Brackets, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
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
}
