package com.example.demo.service;

import com.example.demo.dto.EmailCheckResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.NicknameCheckResponse;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.dto.RegisterResponse;
import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public NicknameCheckResponse checkNickname(String nickname) {
        return new NicknameCheckResponse(!memberRepository.existsByNickname(nickname));
    }

    public EmailCheckResponse checkEmail(String email) {
        return new EmailCheckResponse(!memberRepository.existsByEmail(email));
    }

    public RegisterResponse register(RegisterRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다.");
        }
        if (memberRepository.existsByNickname(request.nickname())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 닉네임입니다.");
        }

        Member member = new Member(
                request.email(),
                passwordEncoder.encode(request.password()),
                request.nickname()
        );

        try {
            return new RegisterResponse(memberRepository.save(member).getMemberId());
        } catch (DataIntegrityViolationException e) {
            // 위 체크와 저장 사이에 같은 값으로 먼저 가입된 경우 (UNIQUE 제약 위반)
            throw new ResponseStatusException(HttpStatus.CONFLICT, "이미 사용 중인 이메일 또는 닉네임입니다.");
        }
    }

    public LoginResponse login(LoginRequest request) {
        // 이메일이 없는 경우와 비밀번호가 틀린 경우를 구분하지 않음 (가입 여부 노출 방지)
        return memberRepository.findByEmail(request.email())
                .filter(member -> passwordEncoder.matches(request.password(), member.getPassword()))
                .map(member -> LoginResponse.success(member.getMemberId()))
                .orElseGet(LoginResponse::fail);
    }
}
