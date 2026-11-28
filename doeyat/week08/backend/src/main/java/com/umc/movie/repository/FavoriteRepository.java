package com.umc.movie.repository;
import com.umc.movie.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface FavoriteRepository extends JpaRepository<Favorite,Long> {
 List<Favorite> findByMember_MemberIdOrderByCreatedAtDescFavoriteIdDesc(Long memberId);
 Optional<Favorite> findByMember_MemberIdAndMovieId(Long memberId,Long movieId);
 boolean existsByMember_MemberIdAndMovieId(Long memberId,Long movieId);
}
