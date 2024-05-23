import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../entity/product.entity';
import { Repository } from 'typeorm';
import { exec } from 'child_process';
import fetch from 'node-fetch';
import getImageS3 from '../../utils/getImageS3';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getProductByCategory(): Promise<any> {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .select('p.id', 'product_id')
      .addSelect('p.name', 'product_name')
      .addSelect('p.price', 'price')
      .addSelect('p.image', 'image')
      .addSelect('c.name', 'category_name')
      .addSelect('c.rank', 'category_rank')
      .addSelect('b.name', 'brand')
      .addSelect('GROUP_CONCAT(c2.name)', 'colors')
      .innerJoin('p.category', 'c')
      .innerJoin('p.brand', 'b')
      .innerJoin('p.colors', 'c2') //Color property -> Color table Alias
      .where('p.categoryRank = 1')
      .groupBy('p.id')
      .orderBy('c.rank')
      .getRawMany();

    for (const product of products) {
      if (product.image) {
        const images = JSON.parse(product.image);
        delete product.image;
        product.image = await getImageS3(images.images);
      }
    }

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Product fetched successfully',
      data: products,
    };
  }

  async getProductByBrand(): Promise<any> {
    const products = await this.productRepository
      .createQueryBuilder('p')
      .select('p.id', 'product_id')
      .addSelect('p.name', 'product_name')
      .addSelect('p.price', 'price')
      .addSelect('p.image', 'image')
      .addSelect('b.name', 'brand')
      .addSelect('b.rank', 'brand_rank')
      .addSelect('c.name', 'category_name')
      .addSelect('GROUP_CONCAT(c2.name)', 'colors')
      .innerJoin('p.brand', 'b')
      .innerJoin('p.category', 'c')
      .innerJoin('p.colors', 'c2') //Color property -> Color table Alias
      .where('p.brandRank = 1')
      .groupBy('p.id')
      .orderBy('b.rank')
      .getRawMany();

    for (const product of products) {
      if (product.image) {
        const images = JSON.parse(product.image);
        delete product.image;
        product.image = await getImageS3(images.images);
      }
    }

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Product fetched successfully',
      data: products,
    };
  }

  async getGeoLocation(): Promise<any> {
    let ip: any;

    await this.findClientIP()
      .then((stdout) => {
        ip = stdout;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    const url = `http://api.ipstack.com/${ip}?access_key=${process.env.GEO_LOCATION_API_KEY}`;
    const response = await fetch(url.replace(/\r?\n|\r/g, ''));

    const result = await response.json();

    // noinspection JSUnresolvedReference
    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Location fetched!',
      data: {
        country: result.country_name ? result.country_name : '',
        city: result.city ? result.city : '',
      },
    };
  }

  async findClientIP(): Promise<any> {
    return new Promise((resolve, reject) => {
      exec('curl ip-adresim.app', function (error, stdout) {
        if (error) {
          reject(error);
          return;
        }
        resolve(stdout);
      });
    });
  }
}
