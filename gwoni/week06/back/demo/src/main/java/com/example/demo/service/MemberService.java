package com.example.demo.service;

import com.example.demo.common.exception.ErrorStatus;
import com.example.demo.common.exception.GeneralException;
import com.example.demo.dto.EmailCheckResponse;
import com.example.demo.dto.LoginRequest;
import com.example.demo.dto.LoginResponse;
import com.example.demo.dto.MemberResponse;
import com.example.demo.dto.NicknameCheckResponse;
import com.example.demo.dto.SignUpRequest;
import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class MemberService {

    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
    private static final Pattern PASSWORD_PATTERN =
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).{8,}$");
    private static final int EMAIL_MAX_LENGTH = 254;
    private static final int PASSWORD_MAX_BYTES = 72;
    private static final int NICKNAME_MIN_LENGTH = 2;
    private static final int NICKNAME_MAX_LENGTH = 12;

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public NicknameCheckResponse checkNickname(String nickname) {
        return new NicknameCheckResponse(!memberRepository.existsByNickname(nickname));
    }

    public EmailCheckResponse checkEmail(String email) {
        return new EmailCheckResponse(!memberRepository.existsByEmail(email));
    }

    public MemberResponse signUp(SignUpRequest request) {
        validateEmail(request.getEmail());
        validatePassword(request.getPassword());
        validateNickname(request.getNickname());

        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new GeneralException(ErrorStatus.MEMBER_EMAIL_DUPLICATED);
        }
        if (memberRepository.existsByNickname(request.getNickname())) {
            throw new GeneralException(ErrorStatus.MEMBER_NICKNAME_DUPLICATED);
        }

        Member member = Member.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .build();

        return MemberResponse.from(memberRepository.save(member));
    }

    public LoginResponse login(LoginRequest request) {
        return memberRepository.findByEmail(request.getEmail())
                .filter(member -> passwordEncoder.matches(request.getPassword(), member.getPassword()))
                .map(member -> LoginResponse.success(member.getMemberId()))
                .orElseGet(LoginResponse::fail);
    }

    private void validateEmail(String email) {
        if (email.length() > EMAIL_MAX_LENGTH || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new GeneralException(ErrorStatus.INVALID_EMAIL);
        }
    }

    private void validatePassword(String password) {
        if (password.getBytes(StandardCharsets.UTF_8).length > PASSWORD_MAX_BYTES
                || !PASSWORD_PATTERN.matcher(password).matches()) {
            throw new GeneralException(ErrorStatus.INVALID_PASSWORD);
        }
    }

    private void validateNickname(String nickname) {
        if (nickname.length() < NICKNAME_MIN_LENGTH || nickname.length() > NICKNAME_MAX_LENGTH) {
            throw new GeneralException(ErrorStatus.INVALID_NICKNAME);
        }
    }
}
