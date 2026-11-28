package com.umc.movie.entity;
import jakarta.persistence.*;
import lombok.*;
@Entity @Getter @NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name="favorite", uniqueConstraints=@UniqueConstraint(name="uk_favorite_member_movie", columnNames={"member_id","movie_id"}))
public class Favorite extends BaseTimeEntity {
 @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long favoriteId;
 @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="member_id",nullable=false) private Member member;
 @Column(name="movie_id",nullable=false) private Long movieId;
 public Favorite(Member member, Long movieId) { this.member=member; this.movieId=movieId; }
}
