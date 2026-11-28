import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFavoriteDto {
  @ApiProperty({
    description: '즐겨찾기에 등록할 영화 ID',
    example: 550,
    type: Number,
    minimum: 1,
  })
  @IsNotEmpty({ message: '영화 ID는 필수입니다.' })
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @IsPositive({ message: '영화 ID는 양수여야 합니다.' })
  movieId: number;
}