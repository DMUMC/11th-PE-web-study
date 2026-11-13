package com.umc.movie.service;

import com.umc.movie.dto.CheckResponse;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;

    public CheckResponse checkNickname(String nickname) {
        boolean exists = memberRepository.existsByNickname(nickname);

        // 이미 존재하면 사용 불가이므로 false를 반환합니다.
        return new CheckResponse(!exists);
    }

    public CheckResponse checkEmail(String email) {
        boolean exists = memberRepository.existsByEmail(email);

        return new CheckResponse(!exists);
    }
}