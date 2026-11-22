package com.example.demo.service;

import com.example.demo.common.exception.ErrorStatus;
import com.example.demo.common.exception.GeneralException;
import com.example.demo.dto.CreateMovieRecordRequest;
import com.example.demo.dto.FavoriteResponse;
import com.example.demo.dto.MovieRecordResponse;
import com.example.demo.dto.RatingResponse;
import com.example.demo.entity.Favorite;
import com.example.demo.entity.Member;
import com.example.demo.entity.Rating;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.MemberRepository;
import com.example.demo.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MovieRecordService {

    private final MemberRepository memberRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;

    // 평점 저장과 즐겨찾기 저장을 하나의 트랜잭션으로 묶음
    // 둘 중 하나라도 런타임 예외로 실패하면 앞선 저장까지 rollback
    @Transactional
    public MovieRecordResponse create(Long memberId, CreateMovieRecordRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.MEMBER_NOT_FOUND));

        if (ratingRepository.existsByMovie(memberId, request.getMovieId())) {
            throw new GeneralException(ErrorStatus.RATING_DUPLICATED);
        }

        boolean addToFavorites = Boolean.TRUE.equals(request.getAddToFavorites());
        if (addToFavorites
                && favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.getMovieId())) {
            throw new GeneralException(ErrorStatus.FAVORITE_DUPLICATED);
        }

        Rating savedRating = ratingRepository.save(Rating.builder()
                .member(member)
                .movieId(request.getMovieId())
                .score(request.getScore())
                .comment(request.getComment())
                .build());

        FavoriteResponse favoriteResponse = null;
        if (addToFavorites) {
            Favorite savedFavorite = favoriteRepository.save(Favorite.builder()
                    .member(member)
                    .movieId(request.getMovieId())
                    .build());
            favoriteResponse = FavoriteResponse.from(savedFavorite);
        }

        return new MovieRecordResponse(RatingResponse.from(savedRating), favoriteResponse);
    }
}
