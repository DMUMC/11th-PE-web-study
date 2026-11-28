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
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import type { Request } from 'express';

import { MemberService } from '../service/member.service.js';
import { CreateMemberDto } from '../dto/create-member.dto.js';
import { MemberUpdateRequestDto } from '../dto/member-update-request.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';

interface AuthRequest extends Request {
  memberId?: number;
}

@ApiTags('회원')
@Controller('members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  // 닉네임 중복 체크
  @Get('nickname/:nickname')
  @ApiOperation({
    summary: '닉네임 중복 확인',
    description: '이미 사용 중인 닉네임인지 확인합니다.',
  })
  @ApiParam({
    name: 'nickname',
    description: '확인할 닉네임',
    example: 'goyo',
  })
  @ApiResponse({
    status: 200,
    description: '닉네임 중복 확인 성공',
  })
  checkNickname(@Param('nickname') nickname: string) {
    return this.memberService.checkNickname(nickname);
  }

  // 이메일 중복 체크
  @Get('email/:email')
  @ApiOperation({
    summary: '이메일 중복 확인',
    description: '이미 가입된 이메일인지 확인합니다.',
  })
  @ApiParam({
    name: 'email',
    description: '확인할 이메일',
    example: 'test@example.com',
  })
  @ApiResponse({
    status: 200,
    description: '이메일 중복 확인 성공',
  })
  checkEmail(@Param('email') email: string) {
    return this.memberService.checkEmail(email);
  }

  // 회원가입
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '회원가입',
    description: '새로운 회원을 등록합니다.',
  })
  @ApiBody({ type: CreateMemberDto })
  @ApiResponse({
    status: 201,
    description: '회원가입 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 형식',
  })
  async signUp(@Body() dto: CreateMemberDto) {
    const result = await this.memberService.signUp(dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '회원가입에 성공했습니다.',
      result,
    };
  }

  // 로그인한 회원 정보 조회
  @Get('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '내 정보 조회',
    description: '로그인한 회원의 정보를 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '회원 정보 조회 성공',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  async getMyInfo(@Req() request: AuthRequest) {
    const memberId = request.memberId;

    if (memberId === undefined) {
      throw new UnauthorizedException(
        '인증된 회원 ID를 찾을 수 없습니다.',
      );
    }

    const result = await this.memberService.getMyInfo(memberId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 조회했습니다.',
      result,
    };
  }

  // 로그인한 회원 정보 수정
  @Patch('me')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '내 정보 수정',
    description: '로그인한 회원의 정보를 수정합니다.',
  })
  @ApiBody({ type: MemberUpdateRequestDto })
  @ApiResponse({
    status: 200,
    description: '회원 정보 수정 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 형식',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  async updateMyInfo(
    @Req() request: AuthRequest,
    @Body() dto: MemberUpdateRequestDto,
  ) {
    const memberId = request.memberId;

    if (memberId === undefined) {
      throw new UnauthorizedException(
        '인증된 회원 ID를 찾을 수 없습니다.',
      );
    }

    const result = await this.memberService.updateMyInfo(
      memberId,
      dto,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '회원 정보를 수정했습니다.',
      result,
    };
  }
}