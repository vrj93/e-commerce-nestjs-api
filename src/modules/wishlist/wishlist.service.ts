import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Product } from '../../entity/product.entity';

@Injectable()
export class WishlistService {
  constructor(private readonly userService: UserService) {}

  async addToWishlist(req: any): Promise<any> {
    const userObj = await this.userService.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wishlists', 'product')
      .where('user.id = :id', { id: req.userId })
      .getOne();

    const wishlist = new Product(); //Object is required instead of Stand-Alone values.
    wishlist.id = req.productId;
    userObj.wishlists = [...userObj.wishlists, wishlist];

    try {
      await this.userService.userRepository.save(userObj);
    } catch (err) {
      throw new Error(err);
    }

    return {
      flag: true,
      status: HttpStatus.CREATED,
      msg: 'Added to Wishlist!',
    };
  }

  async getWishlist(userId: any): Promise<any> {
    const userObj = await this.userService.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.wishlists', 'product')
      .where('user.id = :id', { id: userId })
      .getOne();

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Wishlist fetched!',
      data: userObj.wishlists,
    };
  }
}
