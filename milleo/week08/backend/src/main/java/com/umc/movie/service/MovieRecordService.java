package com.umc.movie.service;
import com.umc.movie.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class MovieRecordService {
    private final RatingService ratings;
    private final FavoriteService favorites;
    @Transactional
    public MovieRecordResponse create(Long memberId, MovieRecordRequest request) {
        RatingResponse rating = ratings.create(memberId,
            new RatingCreateRequest(request.movieId(), request.score(), request.comment()));
        FavoriteResponse favorite = request.addToFavorites()
            ? favorites.create(memberId, request.movieId()) : null;
        return new MovieRecordResponse(rating, favorite);
    }
}
