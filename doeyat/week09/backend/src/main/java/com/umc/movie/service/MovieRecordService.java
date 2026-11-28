package com.umc.movie.service;
import com.umc.movie.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
@Service @RequiredArgsConstructor
public class MovieRecordService {
 private final RatingService ratings;
 private final FavoriteService favorites;
 public record Result(RatingResponse rating,FavoriteResponse favorite) {}
 @Transactional public Result create(Long memberId,MovieRecordRequest body) {
  var rating=ratings.create(memberId,new RatingCreateRequest(body.movieId(),body.score(),body.comment()));
  FavoriteResponse favorite=null;
  if(body.addToFavorites()) favorite=favorites.create(memberId,body.movieId());
  return new Result(rating,favorite);
 }
}
