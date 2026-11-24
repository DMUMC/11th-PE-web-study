package com.umc.movie.dto;

import com.umc.movie.entity.Member;

import java.time.LocalDateTime;

// 엔티티를 그대로 내보내면 password까지 나가므로 필요한 값만 옮겨 담는다.
// memberId는 프론트가 공개 API인 유저별 평점 조회에서 내 평점을 찾을 때 쓴다.
public record MemberInfoResponse(
        Long memberId,
        String email,
        String nickname,
        LocalDateTime createdAt
) {
    public static MemberInfoResponse from(Member member) {
        return new MemberInfoResponse(member.getMemberId(), member.getEmail(), member.getNickname(), member.getCreatedAt());
    }
}
