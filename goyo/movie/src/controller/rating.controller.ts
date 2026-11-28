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

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import type { Request } from 'express';

import { RatingService } from '../service/rating.service.js';
import { CreateRatingDto } from '../dto/create-rating.dto.js';
import { UpdateRatingDto } from '../dto/update-rating.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';

interface AuthRequest extends Request {
  memberId?: number;
}

@ApiTags('평점')
@Controller()
export class RatingController {
  constructor(private readonly ratingService: RatingService) {}

  // 유저별 평점 조회 (공개 API)
  @Get('members/:memberId/ratings')
  @ApiOperation({
    summary: '유저별 평점 조회',
    description: '특정 회원이 등록한 평점 목록을 조회합니다. 토큰이 필요하지 않습니다.',
  })
  @ApiParam({
    name: 'memberId',
    description: '회원 ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: '평점 목록 조회 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 회원 ID',
  })
  getMemberRatings(
    @Param('memberId', ParseIntPipe) memberId: number,
  ) {
    return this.ratingService.getRatingsByMember(memberId);
  }

  // 평점 등록 (로그인 필요)
  @Post('ratings')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({
    summary: '평점 등록',
    description: '영화에 대한 평점과 후기를 등록합니다. JWT 토큰이 필요합니다.',
  })
  @ApiBody({ type: CreateRatingDto })
  @ApiResponse({
    status: 201,
    description: 'COMMON201 - 평점 등록 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: 401,
    description: 'AUTH401_2 / AUTH401_3 / AUTH401_4 - 인증 실패',
  })
  @ApiResponse({
    status: 409,
    description: 'RATING409_1 - 이미 등록된 영화 평점',
  })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: '평점 수정',
    description: '본인이 등록한 평점과 후기를 수정합니다. JWT 토큰이 필요합니다.',
  })
  @ApiParam({
    name: 'ratingId',
    description: '수정할 평점 ID',
    example: 1,
    type: Number,
  })
  @ApiBody({ type: UpdateRatingDto })
  @ApiResponse({
    status: 200,
    description: 'COMMON200 - 평점 수정 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
  })
  @ApiResponse({
    status: 401,
    description: 'AUTH401_2 / AUTH401_3 / AUTH401_4 - 인증 실패',
  })
  @ApiResponse({
    status: 403,
    description: 'RATING403_1 - 다른 회원의 평점 수정 불가',
  })
  @ApiResponse({
    status: 404,
    description: '평점을 찾을 수 없음',
  })
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
  @ApiBearerAuth()
  @ApiOperation({
    summary: '평점 삭제',
    description: '본인이 등록한 평점을 삭제합니다. JWT 토큰이 필요합니다.',
  })
  @ApiParam({
    name: 'ratingId',
    description: '삭제할 평점 ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'COMMON200 - 평점 삭제 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 평점 ID',
  })
  @ApiResponse({
    status: 401,
    description: 'AUTH401_2 / AUTH401_3 / AUTH401_4 - 인증 실패',
  })
  @ApiResponse({
    status: 403,
    description: '다른 회원의 평점 삭제 불가',
  })
  @ApiResponse({
    status: 404,
    description: '평점을 찾을 수 없음',
  })
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