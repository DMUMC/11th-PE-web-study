package com.umc.movie.controller;

import com.umc.movie.dto.*;
import com.umc.movie.service.AccountService;
import com.umc.movie.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import static com.umc.movie.config.OpenApiConfig.BEARER_AUTH;
import static com.umc.movie.config.OpenApiConfig.JWT_ERRORS;

@RestController @RequiredArgsConstructor
public class AccountController {
    private final AccountService accounts;
    private final JwtUtil jwtUtil;
    public record LoginResponse(String accessToken, String tokenType) {}
    @PostMapping("/auth/login")
    @Tag(name = "Auth", description = "로그인과 JWT 발급")
    @Operation(summary = "로그인", description = "토큰 없이 이메일과 비밀번호를 제출합니다. 성공 시 result.accessToken에 JWT를 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 로그인 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 로그인 입력 오류"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_1 이메일 또는 비밀번호 불일치")
    })
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        ProfileResponse member = accounts.login(request);
        response.setHeader("Cache-Control", "no-store");
        String token = jwtUtil.createAccessToken(member.memberId(), member.email());
        return ApiResponse.success("COMMON200", "로그인에 성공했습니다.", new LoginResponse(token,"Bearer"));
    }
    @GetMapping("/members/me")
    @Tag(name = "Profile", description = "JWT가 필요한 내 정보 API")
    @Operation(summary = "내 정보 조회", security = @SecurityRequirement(name = BEARER_AUTH))
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 조회 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = JWT_ERRORS),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음")
    })
    public ApiResponse<ProfileResponse> me(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", accounts.me(memberId));
    }
    @PatchMapping("/members/me")
    @Tag(name = "Profile")
    @Operation(summary = "내 정보 수정", description = "닉네임은 필수입니다. 이메일과 소개를 생략하면 기존 값이 유지됩니다.",
            security = @SecurityRequirement(name = BEARER_AUTH))
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 수정 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 프로필 입력 오류"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = JWT_ERRORS),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER4091 이메일 중복 / MEMBER409_1 닉네임 중복 / COMMON409 DB 제약 충돌")
    })
    public ApiResponse<ProfileResponse> update(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId,
                                              @Valid @RequestBody ProfileUpdateRequest request) {
        return ApiResponse.success("COMMON200", "정보를 수정했습니다.", accounts.update(memberId,request));
    }
}
