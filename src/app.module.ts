import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ProductModule } from './modules/product/product.module';
import { Product } from './entity/product.entity';
import { Brand } from './entity/brand.entity';
import { Color } from './entity/color.entity';
import { Category } from './entity/category.entity';
import { Country } from './entity/country.entity';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AuthMiddleware } from './middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { Address } from './entity/address.entity';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { CartModule } from './modules/cart/cart.module';
import { OrderModule } from './modules/order/order.module';
import { Order } from './entity/order.entity';
import { PaymentModule } from './modules/payment/payment.module';
import { Payment } from './entity/payment.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: 'e_commerce',
      entities: [
        User,
        Product,
        Brand,
        Color,
        Category,
        Country,
        Address,
        Order,
        Payment,
      ],
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: `${process.env.JWT_SECRET}`,
      signOptions: { expiresIn: '3600s' },
    }),
    MailerModule.forRoot({
      transport: {
        host: `${process.env.MAIL_HOST}`,
        port: 2525,
        auth: {
          user: `${process.env.MAIL_USER}`,
          pass: `${process.env.MAIL_PASSWORD}`,
        },
      },
    }),
    UserModule,
    ProductModule,
    DashboardModule,
    WishlistModule,
    CartModule,
    OrderModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: 'user/:id(\\d+)', method: RequestMethod.GET },
        { path: 'user/manage/:id', method: RequestMethod.PUT },
        { path: 'wishlist/*', method: RequestMethod.ALL },
        { path: 'cart/*', method: RequestMethod.ALL },
        { path: 'order/*', method: RequestMethod.ALL },
        { path: 'payment/*', method: RequestMethod.ALL },
      );
  }
}
