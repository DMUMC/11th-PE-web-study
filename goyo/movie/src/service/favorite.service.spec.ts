import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpStatus } from '@nestjs/common';

import { FavoriteService } from './favorite.service.js';
import { Favorite } from '../entity/favorite.enttity.js';
import { Member } from '../entity/member.entity.js';
import { ApiException } from '../exception/api.exception.js';

describe('FavoriteService', () => {
  let service: FavoriteService;

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

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          FavoriteService,
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

    service = module.get<FavoriteService>(FavoriteService);
  });

  describe('create', () => {
    it('즐겨찾기에 등록되지 않은 영화는 정상적으로 등록한다', async () => {
      const member = { memberId: 1 };
      const dto = { movieId: 550 };

      const favorite = {
        favoriteId: 1,
        member,
        movieId: 550,
      };

      mockMemberRepository.findOneBy.mockResolvedValue(member);
      mockFavoriteRepository.findOne.mockResolvedValue(null);
      mockFavoriteRepository.create.mockReturnValue(favorite);
      mockFavoriteRepository.save.mockResolvedValue(favorite);

      const result = await service.create(1, dto);

      expect(result).toEqual({
        favoriteId: 1,
        movieId: 550,
      });

      expect(mockFavoriteRepository.save).toHaveBeenCalledTimes(1);
    });

    it('이미 등록된 영화는 409 예외를 발생시킨다', async () => {
      const member = { memberId: 1 };
      const dto = { movieId: 550 };

      mockMemberRepository.findOneBy.mockResolvedValue(member);

      mockFavoriteRepository.findOne.mockResolvedValue({
        favoriteId: 1,
        member,
        movieId: 550,
      });

      await expect(
        service.create(1, dto),
      ).rejects.toThrow(
        new ApiException(
          HttpStatus.CONFLICT,
          'FAVORITE409_1',
          '이미 이 영화를 즐겨찾기하셨습니다.',
        ),
      );

      expect(mockFavoriteRepository.save).not.toHaveBeenCalled();
    });
  });
});