import { IsEmail, IsNotEmpty } from 'class-validator';

export class SearchEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
