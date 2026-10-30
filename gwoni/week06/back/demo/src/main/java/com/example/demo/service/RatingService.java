package com.example.demo.service;

import com.example.demo.common.exception.ErrorStatus;
import com.example.demo.common.exception.GeneralException;
import com.example.demo.dto.CreateRatingRequest;
import com.example.demo.dto.RatingCreateResponse;
import com.example.demo.dto.RatingResponse;
import com.example.demo.dto.UpdateRatingRequest;
import com.example.demo.entity.Member;
import com.example.demo.entity.Rating;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {

    private static final int SCORE_MIN = 1;
    private static final int SCORE_MAX = 5;
    private static final int COMMENT_MAX_LENGTH = 500;

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

    public RatingCreateResponse create(Long memberId, CreateRatingRequest request) {
        validateMovieId(request.getMovieId());
        validateScore(request.getScore());
        validateComment(request.getComment());

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.MEMBER_NOT_FOUND));

        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.getMovieId())) {
            throw new GeneralException(ErrorStatus.RATING_DUPLICATED);
        }

        Rating rating = Rating.builder()
                .member(member)
                .movieId(request.getMovieId())
                .score(request.getScore())
                .comment(request.getComment())
                .build();

        return new RatingCreateResponse(ratingRepository.save(rating).getRatingId());
    }

    public RatingResponse update(Long memberId, Long ratingId, UpdateRatingRequest request) {
        validateScore(request.getScore());
        validateComment(request.getComment());

        Rating rating = findOwnedRating(memberId, ratingId);
        rating.update(request.getScore(), request.getComment());
        return RatingResponse.from(ratingRepository.save(rating));
    }

    public void delete(Long memberId, Long ratingId) {
        ratingRepository.delete(findOwnedRating(memberId, ratingId));
    }

    private Rating findOwnedRating(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.RATING_NOT_FOUND));

        if (!ratingRepository.existsByRatingIdAndMember_MemberId(ratingId, memberId)) {
            throw new GeneralException(ErrorStatus.RATING_FORBIDDEN);
        }
        return rating;
    }

    private void validateMovieId(Long movieId) {
        if (movieId <= 0) {
            throw new GeneralException(ErrorStatus.INVALID_MOVIE_ID);
        }
    }

    private void validateScore(Integer score) {
        if (score < SCORE_MIN || score > SCORE_MAX) {
            throw new GeneralException(ErrorStatus.INVALID_SCORE);
        }
    }

    private void validateComment(String comment) {
        if (comment != null && comment.length() > COMMENT_MAX_LENGTH) {
            throw new GeneralException(ErrorStatus.INVALID_COMMENT);
        }
    }
}
