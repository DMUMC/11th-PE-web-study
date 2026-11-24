// src/dto/member-info-response.dto.ts
import { Member } from '../entity/member.entity.js';

export class MemberInfoResponseDto {
  email: string;
  nickname: string;
  createdAt: Date;

  // ?뷀떚?곕? 洹몃?濡??묐떟?섎㈃ password源뚯? ?섍?踰꾨━誘濡?諛섎뱶??DTO濡???꺼 ?댁뒿?덈떎
  static from(member: Member): MemberInfoResponseDto {
    return {
      email: member.email,
      nickname: member.nickname,
      createdAt: member.createdAt,
    };
  }
}
