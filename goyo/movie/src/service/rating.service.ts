
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Member } from "../entity/member.entity.js";
import { Rating } from "../entity/rating.entity.js";

import { CreateRatingDto } from "../dto/create-rating.dto.js";
import { UpdateRatingDto } from "../dto/update-rating.dto.js";
import { RatingResponseDto } from "../dto/rating-response.dto.js";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Rating)
    private readonly ratingRepository: Repository<Rating>,

    @InjectRepository(Member)
    private readonly memberRepository: Repository<Member>,
  ) {}

  // 유저별 평점 조회
  async getRatingsByMember(
    memberId: number,
  ): Promise<RatingResponseDto[]> {
    const member = await this.memberRepository.findOneBy({
      memberId,
    });

    if (!member) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }

    const ratings = await this.ratingRepository.find({
      where: {
        member: {
          memberId,
        },
      },
      order: {
        createdAt: "DESC",
      },
    });

    return ratings.map((rating) =>
      RatingResponseDto.from(rating),
    );
  }

  // 평점 등록
  async create(
    memberId: number,
    dto: CreateRatingDto,
  ): Promise<number> {
    const member = await this.memberRepository.findOneBy({
      memberId,
    });

    if (!member) {
      throw new NotFoundException("존재하지 않는 유저입니다.");
    }

    // 동일 영화에 대한 중복 평점 확인
    const existing = await this.ratingRepository.findOne({
      where: {
        member: {
          memberId,
        },
        movieId: dto.movieId,
      },
    });

    if (existing) {
      throw new ConflictException(
        "이미 이 영화에 평점을 남기셨습니다.",
      );
    }

    // 평점 저장
    const saved = await this.ratingRepository.save(
      this.ratingRepository.create({
        member,
        movieId: dto.movieId,
        score: dto.score,
        comment: dto.comment ?? null,
      }),
    );

    return saved.ratingId;
  }

  // 평점 수정
  async update(
    ratingId: number,
    memberId: number,
    dto: UpdateRatingDto,
  ): Promise<void> {
    const rating = await this.findOwnedRating(
      ratingId,
      memberId,
    );

    rating.score = dto.score;
    rating.comment = dto.comment ?? null;

    await this.ratingRepository.save(rating);
  }

  // 평점 삭제
  async delete(
    ratingId: number,
    memberId: number,
  ): Promise<void> {
    const rating = await this.findOwnedRating(
      ratingId,
      memberId,
    );

    await this.ratingRepository.remove(rating);
  }

  // 평점 존재 여부 및 작성자 확인
  private async findOwnedRating(
    ratingId: number,
    memberId: number,
  ): Promise<Rating> {
    const rating = await this.ratingRepository.findOne({
      where: {
        ratingId,
      },
      relations: {
        member: true,
      },
    });

    // 평점이 존재하지 않는 경우
    if (!rating) {
      throw new NotFoundException(
        "존재하지 않는 평점입니다.",
      );
    }

    // 평점 작성자가 아닌 경우
    if (rating.member.memberId !== memberId) {
      throw new ForbiddenException(
        "본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.",
      );
    }

    return rating;
  }
}
