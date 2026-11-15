package com.umc.movie.repository;

import com.umc.movie.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByMember_MemberIdOrderByRatingIdDesc(Long memberId);

    // 언더스코어는 연관된 member의 memberId를 조건으로 쓴다는 뜻이다.
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
