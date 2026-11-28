import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
} from 'vitest';
import request from 'supertest';

import { RatingController } from '../src/controller/rating.controller.js';
import { RatingService } from '../src/service/rating.service.js';
import { Rating } from '../src/entity/rating.entity.js';
import { Member } from '../src/entity/member.entity.js';
import { AuthGuard } from '../src/guard/auth.guard.js';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter.js';

describe('Rating API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  const member = {
    memberId: 1,
    email: 'test@example.com',
    nickname: '테스트회원',
  };

  const mockRatingRepository = {
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  };

  const mockMemberRepository = {
    findOneBy: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    mockMemberRepository.findOneBy.mockResolvedValue(member);

    mockRatingRepository.findOne.mockResolvedValue(null);

    mockRatingRepository.create.mockImplementation(
      (data) => data,
    );

    mockRatingRepository.save.mockImplementation(
      async (data) => ({
        ratingId: 1,
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    const moduleFixture: TestingModule =
      await Test.createTestingModule({
        imports: [
          JwtModule.register({
            secret: 'test-jwt-secret',
            signOptions: {
              expiresIn: 3600,
            },
          }),
        ],
        controllers: [RatingController],
        providers: [
          RatingService,
          AuthGuard,
          {
            provide: getRepositoryToken(Rating),
            useValue: mockRatingRepository,
          },
          {
            provide: getRepositoryToken(Member),
            useValue: mockMemberRepository,
          },
        ],
      }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();

    const jwtService = moduleFixture.get(JwtService);

    accessToken = await jwtService.signAsync({
      sub: String(member.memberId),
      email: member.email,
    });
  });

  afterEach(async () => {
    await app.close();
  });

  // 1. 인증되지 않은 평점 등록 요청
  it('토큰 없이 평점을 등록하면 401과 AUTH401_2를 반환한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .send({
        movieId: 550,
        score: 5,
        comment: '재미있는 영화입니다.',
      })
      .expect(401);

    expect(response.body.isSuccess).toBe(false);
    expect(response.body.code).toBe('AUTH401_2');

    expect(
      mockRatingRepository.save,
    ).not.toHaveBeenCalled();
  });

  // 2. 인증된 평점 등록 요청
  it('유효한 토큰으로 평점을 등록하면 201과 COMMON201을 반환한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/ratings')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        movieId: 550,
        score: 5,
        comment: '재미있는 영화입니다.',
      })
      .expect(201);

    expect(response.body.isSuccess).toBe(true);
    expect(response.body.code).toBe('COMMON201');
    expect(response.body.result.movieId).toBe(550);
    expect(response.body.result.score).toBe(5);

    expect(
      mockRatingRepository.save,
    ).toHaveBeenCalledTimes(1);
  });
});