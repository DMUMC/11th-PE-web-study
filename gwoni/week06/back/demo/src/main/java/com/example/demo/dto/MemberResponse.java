package com.example.demo.dto;

import com.example.demo.entity.Member;

// 엔티티를 그대로 내보내면 password까지 나가므로 필요한 값만 옮겨 담음
public record MemberResponse(Long memberId, String email, String nickname) {

    public static MemberResponse from(Member member) {
        return new MemberResponse(member.getMemberId(), member.getEmail(), member.getNickname());
    }
}
