package com.example.demo.service;

import com.example.demo.dto.CreateRatingRequest;
import com.example.demo.dto.RatingCreateResponse;
import com.example.demo.dto.RatingResponse;
import com.example.demo.dto.UpdateRatingRequest;
import com.example.demo.entity.Member;
import com.example.demo.entity.Rating;
import com.example.demo.exception.ErrorStatus;
import com.example.demo.exception.GeneralException;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    public List<RatingResponse> getRatingsByMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new GeneralException(ErrorStatus.MEMBER_NOT_FOUND);
        }

        return ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId).stream()
                .map(RatingResponse::from)
                .toList();
    }

    @Transactional
    public RatingCreateResponse create(Long memberId, CreateRatingRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.MEMBER_NOT_FOUND));

        // (member_id, movie_id) 복합 UNIQUE 제약이 최종 안전망이고, 일반적인 경우는 여기서 먼저 막음
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId())) {
            throw new GeneralException(ErrorStatus.RATING_DUPLICATED);
        }

        Rating rating = Rating.builder()
                .member(member)
                .movieId(request.movieId())
                .score(request.score())
                .comment(request.comment())
                .build();

        return new RatingCreateResponse(ratingRepository.save(rating).getRatingId());
    }

    @Transactional
    public RatingResponse update(Long memberId, Long ratingId, UpdateRatingRequest request) {
        Rating rating = findOwnedRating(memberId, ratingId);
        rating.update(request.score(), request.comment());
        // flush 시점에 updated_at이 갱신되므로, 응답에 바뀐 시각을 담기 위해 즉시 flush
        ratingRepository.flush();
        return RatingResponse.from(rating);
    }

    @Transactional
    public void delete(Long memberId, Long ratingId) {
        ratingRepository.delete(findOwnedRating(memberId, ratingId));
    }

    // 먼저 평점이 있는지(404), 있으면 요청자의 것인지(403) 확인
    private Rating findOwnedRating(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.RATING_NOT_FOUND));

        if (!rating.isOwnedBy(memberId)) {
            throw new GeneralException(ErrorStatus.RATING_FORBIDDEN);
        }
        return rating;
    }
}
