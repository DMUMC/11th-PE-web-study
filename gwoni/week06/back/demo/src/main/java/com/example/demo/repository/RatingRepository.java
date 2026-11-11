package com.example.demo.repository;

import com.example.demo.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query("select r from Rating r where r.member.memberId = :memberId order by r.ratingId desc")
    List<Rating> findByMember(@Param("memberId") Long memberId);

    @Query("select case when count(r) > 0 then true else false end from Rating r "
            + "where r.member.memberId = :memberId and r.movieId = :movieId")
    boolean existsByMovie(@Param("memberId") Long memberId, @Param("movieId") Long movieId);

    @Query("select case when count(r) > 0 then true else false end from Rating r "
            + "where r.ratingId = :ratingId and r.member.memberId = :memberId")
    boolean isOwner(@Param("ratingId") Long ratingId, @Param("memberId") Long memberId);
}
