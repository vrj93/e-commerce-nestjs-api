import { IsNotEmpty } from 'class-validator';

export class VerifyUserDto {
  @IsNotEmpty()
  id: number;

  @IsNotEmpty()
  otp: number;
}
