package com.example.demo.service;

import com.example.demo.common.exception.ErrorStatus;
import com.example.demo.common.exception.GeneralException;
import com.example.demo.dto.EmailCheckResponse;
import com.example.demo.dto.MemberInfoResponse;
import com.example.demo.dto.MemberResponse;
import com.example.demo.dto.MemberUpdateRequest;
import com.example.demo.dto.NicknameCheckResponse;
import com.example.demo.dto.SignUpRequest;
import com.example.demo.entity.Member;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public MemberResponse signUp(SignUpRequest request) {
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

    public MemberInfoResponse getMyInfo(Long memberId) {
        return MemberInfoResponse.from(findMember(memberId));
    }

    public MemberInfoResponse updateMyInfo(Long memberId, MemberUpdateRequest request) {
        Member member = findMember(memberId);

        if (memberRepository.existsByNicknameAndMemberIdNot(request.getNickname(), memberId)) {
            throw new GeneralException(ErrorStatus.MEMBER_NICKNAME_DUPLICATED);
        }

        member.updateNickname(request.getNickname());
        return MemberInfoResponse.from(memberRepository.save(member));
    }

    private Member findMember(Long memberId) {
        return memberRepository.findById(memberId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.MEMBER_NOT_FOUND));
    }
}
