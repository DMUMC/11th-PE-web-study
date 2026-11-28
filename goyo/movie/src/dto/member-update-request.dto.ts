import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MemberUpdateRequestDto {
  @ApiProperty({
    description: '변경할 닉네임',
    example: 'newGoyo',
    minLength: 2,
    maxLength: 12,
  })
  @IsString()
  @IsNotEmpty({ message: '닉네임을 입력해주세요.' })
  @Length(2, 12, { message: '닉네임은 2자 이상 12자 이하여야 합니다.' })
  nickname: string;
}