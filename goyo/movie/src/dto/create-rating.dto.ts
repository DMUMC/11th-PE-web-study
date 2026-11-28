import {
  IsInt,
  IsOptional,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import {
  ApiProperty,
  ApiPropertyOptional,
} from '@nestjs/swagger';

export class CreateRatingDto {
  @ApiProperty({
    description: '평점을 등록할 영화 ID',
    example: 550,
    type: 'integer',
    minimum: 1,
  })
  @IsInt({ message: '영화 ID는 정수여야 합니다.' })
  @Min(1, { message: '영화 ID는 양수여야 합니다.' })
  movieId: number;

  @ApiProperty({
    description: '영화 별점 (1~5점)',
    example: 5,
    type: 'integer',
    minimum: 1,
    maximum: 5,
  })
  @IsInt({ message: '별점은 정수여야 합니다.' })
  @Min(1, { message: '별점은 1점 이상이어야 합니다.' })
  @Max(5, { message: '별점은 5점 이하여야 합니다.' })
  score: number;

  @ApiPropertyOptional({
    description: '영화 후기',
    example: '재미있게 본 영화입니다.',
    maxLength: 500,
  })
  @IsOptional()
  @MaxLength(500, { message: '후기는 500자 이하로 입력해주세요.' })
  comment?: string;
}