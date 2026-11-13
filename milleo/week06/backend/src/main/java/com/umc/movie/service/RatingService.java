package com.umc.movie.service;

import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.RatingCreateRequest;
import com.umc.movie.dto.RatingUpdateRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RatingService {
    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다.");
        }

        return ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId).stream()
                .map(RatingResponse::from)
                .toList();
    }
    @Transactional
    public RatingResponse create(Long memberId, RatingCreateRequest request) {
        Member member = memberRepository.findById(memberId).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "MEMBER404", "존재하지 않는 회원입니다."));
        if (ratingRepository.existsByMember_MemberIdAndMovieId(memberId, request.movieId()))
            throw new ApiException(HttpStatus.CONFLICT, "RATING409", "이미 평점을 등록한 영화입니다.");
        return RatingResponse.from(ratingRepository.saveAndFlush(
                new Rating(member, request.movieId(), request.score(), request.comment())));
    }

    @Transactional
    public RatingResponse update(Long memberId, Long ratingId, RatingUpdateRequest request) {
        Rating rating = ownedRating(memberId, ratingId);
        rating.update(request.score(), request.comment());
        ratingRepository.flush();
        return RatingResponse.from(rating);
    }

    @Transactional
    public void delete(Long memberId, Long ratingId) {
        ratingRepository.delete(ownedRating(memberId, ratingId));
        ratingRepository.flush();
    }

    private Rating ownedRating(Long memberId, Long ratingId) {
        Rating rating = ratingRepository.findById(ratingId).orElseThrow(() ->
                new ApiException(HttpStatus.NOT_FOUND, "RATING404", "존재하지 않는 평점입니다."));
        if (!rating.getMember().getMemberId().equals(memberId))
            throw new ApiException(HttpStatus.FORBIDDEN, "RATING403", "본인의 평점만 변경할 수 있습니다.");
        return rating;
    }
}
