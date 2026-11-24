package com.umc.movie.repository;

import com.umc.movie.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface MemberRepository extends JpaRepository<Member, Long> {
    boolean existsByNickname(String nickname);

    boolean existsByEmail(String email);

    boolean existsByNicknameAndMemberIdNot(String nickname, Long memberId);

    // import java.util.Optional; 도 함께 추가해주세요
    Optional<Member> findByEmail(String email);
}
