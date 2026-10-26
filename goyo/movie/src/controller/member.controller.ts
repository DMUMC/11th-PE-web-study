import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { MemberService } from "../service/member.service.js";

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

  // 유저별 평점 조회
  @Get(":memberId/ratings")
  getMemberRatings(
    @Param("memberId", ParseIntPipe) memberId: number,
  ) {
    return this.memberService.getMemberRatings(memberId);
  }
}