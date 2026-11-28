import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
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

import { CreateFavoriteDto } from '../dto/create-favorite.dto.js';
import { AuthGuard } from '../guard/auth.guard.js';
import { FavoriteService } from '../service/favorite.service.js';

type AuthenticatedRequest = Request & {
  memberId: number;
};

@ApiTags('즐겨찾기')
@ApiBearerAuth()
@Controller('favorites')
@UseGuards(AuthGuard)
export class FavoriteController {
  constructor(
    private readonly favoriteService: FavoriteService,
  ) {}

  // 즐겨찾기 등록
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '즐겨찾기 등록',
    description: '특정 영화를 내 즐겨찾기에 등록합니다.',
  })
  @ApiBody({ type: CreateFavoriteDto })
  @ApiResponse({
    status: 201,
    description: '즐겨찾기 등록 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 형식',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  async create(
    @Req() request: AuthenticatedRequest,
    @Body() dto: CreateFavoriteDto,
  ) {
    const result = await this.favoriteService.create(
      request.memberId,
      dto,
    );

    return {
      isSuccess: true,
      code: 'COMMON201',
      message: '즐겨찾기를 등록했습니다.',
      result,
    };
  }

  // 내 즐겨찾기 목록 조회
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '내 즐겨찾기 목록 조회',
    description: '로그인한 회원의 즐겨찾기 목록을 조회합니다.',
  })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 목록 조회 성공',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  async getMyFavorites(
    @Req() request: AuthenticatedRequest,
  ) {
    const result =
      await this.favoriteService.getMyFavorites(
        request.memberId,
      );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '내 즐겨찾기 목록을 조회했습니다.',
      result,
    };
  }

  // 특정 영화 즐겨찾기 여부 조회
  @Get(':movieId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '즐겨찾기 여부 조회',
    description: '특정 영화의 즐겨찾기 등록 여부를 확인합니다.',
  })
  @ApiParam({
    name: 'movieId',
    description: '영화 ID',
    example: 550,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 여부 조회 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 영화 ID',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  async getStatus(
    @Req() request: AuthenticatedRequest,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    const result = await this.favoriteService.getStatus(
      request.memberId,
      movieId,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기 여부를 조회했습니다.',
      result,
    };
  }

  // 즐겨찾기 삭제
  @Delete(':movieId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '즐겨찾기 삭제',
    description: '특정 영화를 내 즐겨찾기에서 삭제합니다.',
  })
  @ApiParam({
    name: 'movieId',
    description: '영화 ID',
    example: 550,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: '즐겨찾기 삭제 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 영화 ID',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  async delete(
    @Req() request: AuthenticatedRequest,
    @Param('movieId', ParseIntPipe) movieId: number,
  ) {
    await this.favoriteService.delete(
      request.memberId,
      movieId,
    );

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '즐겨찾기를 해제했습니다.',
      result: null,
    };
  }
}