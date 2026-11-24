// src/dto/login-request.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDto {
  @IsEmail({}, { message: '?대찓???뺤떇???щ컮瑜댁? ?딆뒿?덈떎.' })
  @IsNotEmpty({ message: '?대찓?쇱쓣 ?낅젰?댁＜?몄슂.' })
  email: string;
  
  @IsString()
  @IsNotEmpty({ message: '鍮꾨?踰덊샇瑜??낅젰?댁＜?몄슂.' })
  password: string;
}

