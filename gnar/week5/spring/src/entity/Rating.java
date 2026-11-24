package com.umc.movie.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "rating",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_rating_member_movie",
                        columnNames = {"member_id", "movie_id"}
                )
        }
)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Rating extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long ratingId;

    // 여러 평점이 한 회원에게 속합니다.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    // 외부 서비스인 TMDB의 영화 ID입니다.
    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(nullable = false)
    private Byte score;

    @Column(columnDefinition = "TEXT")
    private String comment;
}