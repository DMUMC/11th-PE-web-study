
import {
  Injectable,
  NotFoundException,
  ConflictException,
  HttpStatus,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
import * as bcrypt from "bcrypt";

import { Member } from "../entity/member.entity.js";
import { Rating } from "../entity/rating.entity.js";

import { CheckResponseDto } from "../dto/check-response.dto.js";
import { RatingResponseDto } from "../dto/rating-response.dto.js";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { MemberInfoResponseDto } from "../dto/member-info-response.dto.js";
import { MemberUpdateRequestDto } from "../dto/member-update-request.dto.js";

import { ApiException } from "../exception/api.exception.js";

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

  // 회원가입
  async signUp(dto: CreateMemberDto) {
    // 이메일 중복 확인
    const existingEmail = await this.memberRepository.findOneBy({
      email: dto.email,
    });

    if (existingEmail) {
      throw new ConflictException("이미 사용 중인 이메일입니다.");
    }

    // 닉네임 중복 확인
    const existingNickname = await this.memberRepository.findOneBy({
      nickname: dto.nickname,
    });

    if (existingNickname) {
      throw new ConflictException("이미 사용 중인 닉네임입니다.");
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 회원 정보 저장
    const savedMember = await this.memberRepository.save(
      this.memberRepository.create({
        email: dto.email,
        password: hashedPassword,
        nickname: dto.nickname,
      }),
    );

    return {
      memberId: savedMember.memberId,
      email: savedMember.email,
      nickname: savedMember.nickname,
    };
  }

  // 로그인한 회원 정보 조회
  async getMyInfo(memberId: number): Promise<MemberInfoResponseDto> {
    const member = await this.memberRepository.findOne({
      where: { memberId },
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        "MEMBER404_1",
        "해당 회원을 찾을 수 없습니다.",
      );
    }

    return MemberInfoResponseDto.from(member);
  }

  // 로그인한 회원 정보 수정
  async updateMyInfo(
    memberId: number,
    dto: MemberUpdateRequestDto,
  ): Promise<MemberInfoResponseDto> {
    // 회원 존재 여부 확인
    const member = await this.memberRepository.findOne({
      where: { memberId },
    });

    if (!member) {
      throw new ApiException(
        HttpStatus.NOT_FOUND,
        "MEMBER404_1",
        "해당 회원을 찾을 수 없습니다.",
      );
    }

    // 본인을 제외한 다른 회원의 닉네임 중복 확인
    const duplicated = await this.memberRepository.findOne({
      where: {
        nickname: dto.nickname,
        memberId: Not(memberId),
      },
    });

    if (duplicated) {
      throw new ApiException(
        HttpStatus.CONFLICT,
        "MEMBER409_1",
        "이미 사용 중인 닉네임입니다.",
      );
    }

    // 닉네임 수정
    member.nickname = dto.nickname;

    // 변경된 회원 정보 저장
    const updatedMember = await this.memberRepository.save(member);

    // 수정된 회원 정보 반환
    return MemberInfoResponseDto.from(updatedMember);
  }
}
