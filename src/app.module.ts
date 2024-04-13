import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { ProductModule } from './product/product.module';
import { Product } from './entity/product.entity';
import { Brand } from './entity/brand.entity';
import { Color } from './entity/color.entity';
import { Category } from './entity/category.entity';
import { Country } from './entity/country.entity';
import { DashboardModule } from './dashboard/dashboard.module';

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
      entities: [User, Product, Brand, Color, Category, Country],
      synchronize: true,
    }),
    UserModule,
    ProductModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
