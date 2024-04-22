import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { Product } from '../entity/product.entity';

@Injectable()
export class CartService {
  constructor(private readonly userService: UserService) {}

  async addToCart(req: any): Promise<any> {
    const userObj = await this.userService.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.carts', 'product')
      .where('user.id = :id', { id: req.userId })
      .getOne();

    const cart = new Product(); //Object is required instead of Stand-Alone values.
    cart.id = req.productId;
    userObj.carts = [...userObj.carts, cart];

    try {
      await this.userService.userRepository.save(userObj);
    } catch (err) {
      throw new Error(err);
    }

    return {
      flag: true,
      status: HttpStatus.CREATED,
      msg: 'Added to Cart!',
    };
  }

  async getCart(userId: any): Promise<any> {
    const userObj = await this.userService.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.carts', 'product')
      .where('user.id = :id', { id: userId })
      .getOne();

    return {
      flag: true,
      status: HttpStatus.OK,
      msg: 'Cart fetched!',
      data: userObj.carts,
    };
  }
}
