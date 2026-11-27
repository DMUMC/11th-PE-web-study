package com.umc.movie.service;
import com.umc.movie.dto.*;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
@Service @RequiredArgsConstructor
public class AccountService {
    private final MemberRepository members;
    private final PasswordEncoder passwords;
    @Transactional(readOnly=true)
    public ProfileResponse login(LoginRequest request) {
        Member member = members.findByEmail(request.email().trim()).orElseThrow(this::badLogin);
        if (!passwords.matches(request.password(), member.getPassword())) throw badLogin();
        return ProfileResponse.from(member);
    }
    private ApiException badLogin() { return new ApiException(HttpStatus.UNAUTHORIZED,"AUTH401_1","이메일 또는 비밀번호가 올바르지 않습니다."); }
    private Member member(Long id) { return members.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND,"MEMBER404_1","해당 회원을 찾을 수 없습니다.")); }
    @Transactional(readOnly=true)
    public ProfileResponse me(Long id) { return ProfileResponse.from(member(id)); }
    @Transactional
    public ProfileResponse update(Long id, ProfileUpdateRequest request) {
        Member member = member(id);
        String email = (request.email() == null ? member.getEmail() : request.email().trim()), nickname = request.nickname().trim();
        if(email.isBlank()) throw new ApiException(HttpStatus.BAD_REQUEST,"COMMON400","이메일을 입력해 주세요.");
        if(nickname.length()<2 || nickname.length()>12) throw new ApiException(HttpStatus.BAD_REQUEST,"COMMON400","닉네임은 2~12자로 입력해 주세요.");
        if(!email.equals(member.getEmail()) && members.existsByEmail(email)) throw new ApiException(HttpStatus.CONFLICT,"MEMBER4091","이미 사용 중인 이메일입니다.");
        if(!nickname.equals(member.getNickname()) && members.existsByNickname(nickname)) throw new ApiException(HttpStatus.CONFLICT,"MEMBER409_1","이미 사용 중인 닉네임입니다.");
        member.updateProfile(email,nickname,(request.introduction() == null ? member.getIntroduction() : request.introduction().trim()));
        members.flush();
        return ProfileResponse.from(member);
    }
}
