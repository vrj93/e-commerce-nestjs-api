import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  id: number;
  phone: number;
  email: any;
  @IsNotEmpty()
  password: any;
}