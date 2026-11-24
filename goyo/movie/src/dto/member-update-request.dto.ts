// src/dto/member-update-request.dto.ts
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class MemberUpdateRequestDto {
  @IsString()
  @IsNotEmpty({ message: '?됰꽕?꾩쓣 ?낅젰?댁＜?몄슂.' })
  @Length(2, 12, { message: '?됰꽕?꾩? 2???댁긽 12???댄븯?ъ빞 ?⑸땲??' })
  nickname: string;
}
