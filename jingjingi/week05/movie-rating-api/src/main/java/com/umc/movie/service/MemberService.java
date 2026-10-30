package com.umc.movie.service;

import com.umc.movie.dto.AvailabilityResponse;
import com.umc.movie.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @Transactional(readOnly = true)
    public AvailabilityResponse checkNickname(String nickname) {
        return new AvailabilityResponse(!memberRepository.existsByNickname(nickname));
    }

    @Transactional(readOnly = true)
    public AvailabilityResponse checkEmail(String email) {
        return new AvailabilityResponse(!memberRepository.existsByEmail(email));
    }
}
