import { IsNotEmpty } from 'class-validator';

export class ManageAddressDto {
  @IsNotEmpty()
  user: number;
  @IsNotEmpty()
  house: string;
  @IsNotEmpty()
  street: string;
  locality: string;
  @IsNotEmpty()
  city: string;
  @IsNotEmpty()
  pincode: number;
  @IsNotEmpty()
  state: string;
  @IsNotEmpty()
  country: string;
}
