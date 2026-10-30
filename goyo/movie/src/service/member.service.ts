import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Member } from "../entity/member.entity.js";
import { Rating } from "../entity/rating.entity.js";

import { CheckResponseDto } from "../dto/check-response.dto.js";
import { RatingResponseDto } from "../dto/rating-response.dto.js";

@Injectable()
export class MemberService {
  constructor(
    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,

    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,
  ) {}

  // 닉네임 중복 체크
  async checkNickname(nickname: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({
      where: { nickname },
    });

    return { available: !exists };
  }

  // 이메일 중복 체크
  async checkEmail(email: string): Promise<CheckResponseDto> {
    const exists = await this.memberRepository.exists({
      where: { email },
    });

    return { available: !exists };
  }

  // 유저별 평점 조회
  async getMemberRatings(memberId: number): Promise<RatingResponseDto[]> {
    // 회원 존재 여부 확인
    const member = await this.memberRepository.findOne({
      where: { memberId },
    });

    if (!member) {
      throw new NotFoundException("존재하지 않는 회원입니다.");
    }

    // 해당 회원이 작성한 평점 조회
    const ratings = await this.ratingRepository.find({
      where: {
        member: {
          memberId,
        },
      },
      order: {
        createdAt: "DESC",
      },
    });

    // Entity를 DTO로 변환
    return ratings.map((rating) => RatingResponseDto.from(rating));
  }
}