
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';

import type { Request } from 'express';

import { RatingService } from '../service/rating.service.js';
import { CreateRatingDto } from '../dto/create-rating.dto.js';
import { UpdateRatingDto } from '../dto/update-rating.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';

// JWT 인증 후 memberId를 저장하기 위한 Request 타입
interface AuthRequest extends Request {
  memberId?: number;
}

@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // 유저별 평점 조회 (공개 API)
  @Get('members/:memberId/ratings')
  getMemberRatings(
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  // 평점 등록 (로그인 필요)
  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Req() request: AuthRequest,
    @Body() dto: CreateRatingDto,
  ) {
    const memberId = request.memberId;

    if (memberId === undefined) {
      throw new UnauthorizedException(
        '인증된 회원 ID를 찾을 수 없습니다.',
      );
    }

    const result = await this.ratingService.create(memberId, dto);

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '평점을 등록했습니다.',
      result,
    };
  }

  // 평점 수정 (로그인 필요)
  @Patch('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async update(
    @Req() request: AuthRequest,
    @Param('ratingId', ParseIntPipe) ratingId: number,
    @Body() dto: UpdateRatingDto,
  ) {
    const memberId = request.memberId;

    if (memberId === undefined) {
      throw new UnauthorizedException(
        '인증된 회원 ID를 찾을 수 없습니다.',
      );
    }

    const result = await this.ratingService.update(
      memberId,
      ratingId,
      dto,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 수정했습니다.',
      result,
    };
  }

  // 평점 삭제 (로그인 필요)
  @Delete('ratings/:ratingId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @Req() request: AuthRequest,
    @Param('ratingId', ParseIntPipe) ratingId: number,
  ) {
    const memberId = request.memberId;

    if (memberId === undefined) {
      throw new UnauthorizedException(
        '인증된 회원 ID를 찾을 수 없습니다.',
      );
    }

    await this.ratingService.delete(memberId, ratingId);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '평점을 삭제했습니다.',
      result: null,
    };
  }
}
