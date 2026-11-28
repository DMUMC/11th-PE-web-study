import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';

import { AuthService } from '../service/auth.service.js';
import { LoginRequestDto } from '../dto/login-request.dto.js';

@ApiTags('인증')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: '로그인',
    description: '이메일과 비밀번호를 통해 로그인하고 JWT 토큰을 발급받습니다.',
  })
  @ApiBody({ type: LoginRequestDto })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 형식',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  async login(@Body() dto: LoginRequestDto) {
    const result = await this.authService.login(dto);

    return {
      isSuccess: true,
      code: 'COMMON200',
      message: '로그인에 성공했습니다.',
      result,
    };
  }
}