import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';

import { RatingService } from './rating.service.js';
import { Rating } from '../entity/rating.entity.js';
import { Member } from '../entity/member.entity.js';
import { ApiException } from '../exception/api.exception.js';

describe('RatingService', () => {
  let service: RatingService;

  const mockRatingRepository = {
    findOne: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
    remove: vi.fn(),
  };

  const mockMemberRepository = {
    findOneBy: vi.fn(),
  };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          RatingService,
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

    service = module.get<RatingService>(RatingService);
  });

  describe('create', () => {
    it('같은 영화에 평점을 중복 등록하면 409와 RATING409_1을 반환한다', async () => {
      const member = { memberId: 1 };

      const dto = {
        movieId: 550,
        score: 5,
        comment: '재미있는 영화입니다.',
      };

      mockMemberRepository.findOneBy.mockResolvedValue(member);

      mockRatingRepository.findOne.mockResolvedValue({
        ratingId: 1,
        member,
        movieId: 550,
        score: 4,
      });

      const result = service.create(1, dto);

      await expect(result).rejects.toBeInstanceOf(ApiException);

      await expect(result).rejects.toMatchObject({
        code: 'RATING409_1',
        getStatus: expect.any(Function),
      });

      await expect(result).rejects.toHaveProperty(
        'status',
        HttpStatus.CONFLICT,
      );

      expect(
        mockRatingRepository.save,
      ).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('다른 회원의 평점을 수정하면 403과 RATING403_1을 반환한다', async () => {
      const dto = {
        score: 3,
        comment: '수정된 후기입니다.',
      };

      mockRatingRepository.findOne.mockResolvedValue({
        ratingId: 1,
        member: {
          memberId: 2,
        },
        movieId: 550,
        score: 5,
        comment: '기존 후기입니다.',
      });

      const result = service.update(1, 1, dto);

      await expect(result).rejects.toBeInstanceOf(ApiException);

      await expect(result).rejects.toMatchObject({
        code: 'RATING403_1',
        getStatus: expect.any(Function),
      });

      await expect(result).rejects.toHaveProperty(
        'status',
        HttpStatus.FORBIDDEN,
      );

      expect(
        mockRatingRepository.save,
      ).not.toHaveBeenCalled();
    });
  });
});