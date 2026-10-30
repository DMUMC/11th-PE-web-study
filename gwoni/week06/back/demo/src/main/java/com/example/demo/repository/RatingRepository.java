package com.example.demo.repository;

import com.example.demo.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByMember_MemberIdOrderByRatingIdDesc(Long memberId);

    // rating.member.memberId + rating.movieId 조합이 이미 있는지
    boolean existsByMember_MemberIdAndMovieId(Long memberId, Long movieId);
}
