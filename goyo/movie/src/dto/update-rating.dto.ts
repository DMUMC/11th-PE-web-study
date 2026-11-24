// src/dto/update-rating.dto.ts
import { IsInt, IsOptional, Max, MaxLength, Min } from "class-validator";

export class UpdateRatingDto {
  @IsInt({ message: "蹂꾩젏? ?뺤닔?ъ빞 ?⑸땲??" })
  @Min(1, { message: "蹂꾩젏? 1???댁긽?댁뼱???⑸땲??" })
  @Max(5, { message: "蹂꾩젏? 5???댄븯?ъ빞 ?⑸땲??" })
  score: number;

  @IsOptional()
  @MaxLength(500, { message: "?꾧린??500???댄븯濡??낅젰?댁＜?몄슂." })
  comment?: string;
}
