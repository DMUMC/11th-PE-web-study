package com.example.demo.service;

import com.example.demo.auth.JwtProvider;
import com.example.demo.common.exception.ErrorStatus;
import com.example.demo.common.exception.GeneralException;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;

    public LoginResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .filter(m -> passwordEncoder.matches(request.getPassword(), m.getPassword()))
                .orElseThrow(() -> new GeneralException(ErrorStatus.AUTH_LOGIN_FAILED));

        return new LoginResponse(member.getNickname(), jwtProvider.createAccessToken(member.getMemberId()));
    }
}
