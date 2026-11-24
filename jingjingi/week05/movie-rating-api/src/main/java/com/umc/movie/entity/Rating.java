package com.umc.movie.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "rating",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_rating_member_movie",
                columnNames = {"member_id", "movie_id"}
        )
)
public class Rating extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long ratingId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(nullable = false)
    private Byte score;

    @Column(columnDefinition = "TEXT")
    private String comment;

    protected Rating() {
    }

    public Rating(Member member, Long movieId, Integer score, String comment) {
        this.member = member;
        this.movieId = movieId;
        this.score = score.byteValue();
        this.comment = comment;
    }

    public Long getRatingId() {
        return ratingId;
    }

    public Long getMovieId() {
        return movieId;
    }

    public Byte getScore() {
        return score;
    }

    public String getComment() {
        return comment;
    }
}
