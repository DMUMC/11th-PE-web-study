package com.example.demo.service;

import com.example.demo.dto.EmailCheckResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.MemberResponse;
import com.example.demo.dto.NicknameCheckResponse;
import com.example.demo.dto.SignUpRequest;
import com.example.demo.entity.Member;
import com.example.demo.exception.ErrorStatus;
import com.example.demo.exception.GeneralException;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public NicknameCheckResponse checkNickname(String nickname) {
        return new NicknameCheckResponse(!memberRepository.existsByNickname(nickname));
    }

    public EmailCheckResponse checkEmail(String email) {
        return new EmailCheckResponse(!memberRepository.existsByEmail(email));
    }

    @Transactional
    public MemberResponse signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new GeneralException(ErrorStatus.MEMBER_EMAIL_DUPLICATED);
        }
        if (memberRepository.existsByNickname(request.nickname())) {
            throw new GeneralException(ErrorStatus.MEMBER_NICKNAME_DUPLICATED);
        }

        Member member = Member.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .nickname(request.nickname())
                .build();

        // 위 체크와 저장 사이에 같은 값이 먼저 저장되면 DB UNIQUE 제약에서 막히고,
        // DataIntegrityViolationException은 GlobalExceptionHandler가 409로 변환함
        return MemberResponse.from(memberRepository.save(member));
    }

    public LoginResponse login(LoginRequest request) {
        // 이메일이 없는 경우와 비밀번호가 틀린 경우를 구분하지 않음 (가입 여부 노출 방지)
        return memberRepository.findByEmail(request.email())
                .filter(member -> passwordEncoder.matches(request.password(), member.getPassword()))
                .map(member -> LoginResponse.success(member.getMemberId()))
                .orElseGet(LoginResponse::fail);
    }
}
