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

import { FavoriteController } from '../src/controller/favorite.controller.js';
import { FavoriteService } from '../src/service/favorite.service.js';
import { Favorite } from '../src/entity/favorite.enttity.js';
import { Member } from '../src/entity/member.entity.js';
import { AuthGuard } from '../src/guard/auth.guard.js';
import { HttpExceptionFilter } from '../src/filter/http-exception.filter.js';

describe('Favorite API (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  const member = {
    memberId: 1,
    email: 'test@example.com',
  };

  const mockFavoriteRepository = {
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

    mockFavoriteRepository.findOne.mockResolvedValue(null);

    mockFavoriteRepository.create.mockImplementation(
      (data) => data,
    );

    mockFavoriteRepository.save.mockImplementation(
      async (data) => ({
        favoriteId: 1,
        ...data,
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
        controllers: [FavoriteController],
        providers: [
          FavoriteService,
          AuthGuard,
          {
            provide: getRepositoryToken(Favorite),
            useValue: mockFavoriteRepository,
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

  // 1. 인증되지 않은 요청
  it('토큰 없이 즐겨찾기를 등록하면 401을 반환한다', async () => {
    await request(app.getHttpServer())
      .post('/favorites')
      .send({
        movieId: 550,
      })
      .expect(401);

    expect(
      mockFavoriteRepository.save,
    ).not.toHaveBeenCalled();
  });

  // 2. 정상 등록
  it('즐겨찾기를 정상적으로 등록하면 201을 반환한다', async () => {
    const response = await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        movieId: 550,
      })
      .expect(201);

    expect(response.body.isSuccess).toBe(true);
    expect(response.body.code).toBe('COMMON201');
    expect(response.body.result.movieId).toBe(550);

    expect(
      mockFavoriteRepository.save,
    ).toHaveBeenCalledTimes(1);
  });

  // 3. 중복 등록
  it('이미 등록된 영화를 다시 등록하면 409를 반환한다', async () => {
    mockFavoriteRepository.findOne.mockResolvedValue({
      favoriteId: 1,
      member,
      movieId: 550,
    });

    await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        movieId: 550,
      })
      .expect(409);

    expect(
      mockFavoriteRepository.save,
    ).not.toHaveBeenCalled();
  });

  // 4. 잘못된 요청 데이터
  it('잘못된 영화 ID를 전달하면 400을 반환한다', async () => {
    await request(app.getHttpServer())
      .post('/favorites')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        movieId: -1,
      })
      .expect(400);

    expect(
      mockFavoriteRepository.save,
    ).not.toHaveBeenCalled();
  });
});