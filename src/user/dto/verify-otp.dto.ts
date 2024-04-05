import { IsNotEmpty } from 'class-validator';

export class VerifyOTPDto {
  @IsNotEmpty()
  id: number;
  @IsNotEmpty()
  otp: number;
}
