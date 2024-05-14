import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  user: any;
  @IsNotEmpty()
  password: any;
}
