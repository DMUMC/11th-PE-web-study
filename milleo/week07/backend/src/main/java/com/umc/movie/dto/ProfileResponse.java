package com.umc.movie.dto;
import com.umc.movie.entity.Member;
public record ProfileResponse(Long memberId, String email, String nickname, String introduction) {
    public static ProfileResponse from(Member m) { return new ProfileResponse(m.getMemberId(), m.getEmail(), m.getNickname(), m.getIntroduction() == null ? "" : m.getIntroduction()); }
}
