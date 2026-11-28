package com.umc.movie.controller;

import com.umc.movie.dto.*;
import com.umc.movie.service.AccountService;
import com.umc.movie.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController @RequiredArgsConstructor
public class AccountController {
    private final AccountService accounts;
    private final JwtUtil jwtUtil;
    public record LoginResponse(String accessToken, String tokenType) {}
    @PostMapping("/auth/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        ProfileResponse member = accounts.login(request);
        response.setHeader("Cache-Control", "no-store");
        String token = jwtUtil.createAccessToken(member.memberId(), member.email());
        return ApiResponse.success("COMMON200", "로그인에 성공했습니다.", new LoginResponse(token,"Bearer"));
    }
    @GetMapping("/members/me")
    public ApiResponse<ProfileResponse> me(@RequestAttribute("memberId") Long memberId) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", accounts.me(memberId));
    }
    @PatchMapping("/members/me")
    public ApiResponse<ProfileResponse> update(@RequestAttribute("memberId") Long memberId,
                                              @Valid @RequestBody ProfileUpdateRequest request) {
        return ApiResponse.success("COMMON200", "정보를 수정했습니다.", accounts.update(memberId,request));
    }
}
