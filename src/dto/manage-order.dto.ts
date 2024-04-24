import { IsArray, IsNotEmpty, IsOptional } from 'class-validator';

export class ManageOrderDto {
  id: number;

  userId: number;

  @IsArray()
  @IsOptional()
  products: number[] | null;

  addressId: number;

  arrivalDate: Date;

  paymentId: number;
}
