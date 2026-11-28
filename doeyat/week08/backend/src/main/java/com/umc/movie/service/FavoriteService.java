package com.umc.movie.service;
import com.umc.movie.dto.*;
import com.umc.movie.entity.Favorite;
import com.umc.movie.repository.*;
import com.umc.movie.exception.ApiException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.HttpStatus;
import java.util.List;
@Service @RequiredArgsConstructor
public class FavoriteService {
 private final FavoriteRepository favorites;
 private final MemberRepository members;
 @Transactional(readOnly=true) public List<FavoriteResponse> list(Long memberId) {
  return favorites.findByMember_MemberIdOrderByCreatedAtDescFavoriteIdDesc(memberId).stream().map(FavoriteResponse::from).toList();
 }
 @Transactional(readOnly=true) public boolean contains(Long memberId,Long movieId) { return favorites.existsByMember_MemberIdAndMovieId(memberId,movieId); }
 @Transactional public FavoriteResponse create(Long memberId,Long movieId) {
  if(contains(memberId,movieId)) throw new ApiException(HttpStatus.CONFLICT,"FAVORITE409_1","이미 즐겨찾기에 등록한 영화입니다.");
  var member=members.findById(memberId).orElseThrow(()->new ApiException(HttpStatus.NOT_FOUND,"MEMBER404_1","회원을 찾을 수 없습니다."));
  return FavoriteResponse.from(favorites.saveAndFlush(new Favorite(member,movieId)));
 }
 @Transactional public void delete(Long memberId,Long movieId) {
  var favorite=favorites.findByMember_MemberIdAndMovieId(memberId,movieId).orElseThrow(()->new ApiException(HttpStatus.NOT_FOUND,"FAVORITE404_1","즐겨찾기를 찾을 수 없습니다."));
  favorites.delete(favorite); favorites.flush();
 }
}
