
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
} from "@nestjs/common";

import type { Request } from "express";

import { MemberService } from "../service/member.service.js";
import { CreateMemberDto } from "../dto/create-member.dto.js";
import { MemberUpdateRequestDto } from "../dto/member-update-request.dto.js";
import { AuthGuard } from "../guard/auth.guard.js";

// JWT 인증 후 memberId를 저장하기 위한 Request 타입
interface AuthRequest extends Request {
  memberId?: number;
}

@Controller("members")
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // 닉네임 중복 체크
  @Get("nickname/:nickname")
  checkNickname(@Param("nickname") nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  // 이메일 중복 체크
  @Get("email/:email")
  checkEmail(@Param("email") email: string) {
    return this.memberService.checkEmail(email);
  }

  // 회원가입
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);

    return {
      isSuccess: true,
      code: "COMMON201",
      message: "회원가입에 성공했습니다.",
      result,
    };
  }

  // 로그인한 회원 정보 조회
  @Get("me")
  @UseGuards(AuthGuard)
  async getMyInfo(@Req() request: AuthRequest) {
    const memberId = request.memberId;

    if (memberId === undefined) {
      throw new UnauthorizedException(
        "인증된 회원 ID를 찾을 수 없습니다.",
      );
    }

    const result = await this.memberService.getMyInfo(memberId);

    return {
      isSuccess: true,
      code: "COMMON200",
      message: "회원 정보를 조회했습니다.",
      result,
    };
  }

  // 로그인한 회원 정보 수정
  @Patch("me")
  @UseGuards(AuthGuard)
  async updateMyInfo(
    @Req() request: AuthRequest,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const memberId = request.memberId;

    if (memberId === undefined) {
      throw new UnauthorizedException(
        "인증된 회원 ID를 찾을 수 없습니다.",
      );
    }

    const result = await this.memberService.updateMyInfo(
      memberId,
      dto,
    );

    return {
      isSuccess: true,
      code: "COMMON200",
      message: "회원 정보를 수정했습니다.",
      result,
    };
  }
}
