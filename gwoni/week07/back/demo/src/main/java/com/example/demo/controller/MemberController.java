package com.example.demo.controller;

import com.example.demo.auth.LoginMember;
import com.example.demo.auth.LoginRequired;
import com.example.demo.common.response.ApiResponse;
import com.example.demo.dto.EmailCheckResponse;
import com.example.demo.dto.MemberInfoResponse;
import com.example.demo.dto.MemberResponse;
import com.example.demo.dto.MemberUpdateRequest;
import com.example.demo.dto.NicknameCheckResponse;
import com.example.demo.dto.SignUpRequest;
import com.example.demo.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable("nickname") String nickname) {
        return memberService.checkNickname(nickname);
    }

    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable("email") String email) {
        return memberService.checkEmail(email);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(@Valid @RequestBody SignUpRequest request) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }

    @LoginRequired
    @GetMapping("/me")
    public ApiResponse<MemberInfoResponse> getMyInfo(@LoginMember Long memberId) {
        return ApiResponse.ok("내 정보 조회에 성공했습니다.", memberService.getMyInfo(memberId));
    }

    @LoginRequired
    @PatchMapping("/me")
    public ApiResponse<MemberInfoResponse> updateMyInfo(
            @LoginMember Long memberId,
            @Valid @RequestBody MemberUpdateRequest request
    ) {
        return ApiResponse.ok("내 정보 수정에 성공했습니다.", memberService.updateMyInfo(memberId, request));
    }
}
