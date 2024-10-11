import { IsNotEmpty } from 'class-validator';

export class SearchPhoneDto {
  @IsNotEmpty()
  phone: string;
}
