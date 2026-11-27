package com.umc.movie.controller;

import com.umc.movie.dto.EmailCheckResponse;
import com.umc.movie.dto.MemberInfoResponse;
import com.umc.movie.dto.MemberUpdateRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.dto.NicknameCheckResponse;
import com.umc.movie.service.MemberService;
import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.SignUpRequest;
import com.umc.movie.dto.MemberResponse;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@Tag(name = "회원")
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberService;

    @Operation(summary = "내 정보 조회",
            description = "토큰으로 식별한 회원의 정보를 조회합니다. Bearer 토큰이 필요합니다.",
            security = @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
                            description = "조회 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
                            description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 토큰 만료", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                            description = "MEMBER404_1 회원 없음", content = @Content)
            })
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId) {
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", memberService.getMyInfo(memberId)));
    }

    @Operation(summary = "내 정보 수정",
            description = "로그인한 회원의 닉네임을 변경합니다. Bearer 토큰이 필요합니다.",
            security = @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
                            description = "수정 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                            description = "COMMON4001 닉네임 검증 실패", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
                            description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 토큰 만료", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                            description = "MEMBER404_1 회원 없음", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409",
                            description = "MEMBER409_1 닉네임 중복 / COMMON4091 DB 제약 위반", content = @Content)
            })
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @Valid @RequestBody MemberUpdateRequest request) {
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", memberService.updateMyInfo(memberId, request)));
    }

    @Operation(summary = "회원가입",
            description = "이메일과 닉네임을 확인하고 비밀번호를 해시하여 회원을 등록합니다. 토큰 없이 호출할 수 있습니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201",
                            description = "회원가입 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                            description = "COMMON4001 요청 검증 실패 / COMMON400 비밀번호 길이 초과", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409",
                            description = "COMMON4092 이메일 또는 닉네임 중복 / COMMON4091 DB 제약 위반", content = @Content)
            })
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(@Valid @RequestBody SignUpRequest request) {
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", memberService.signUp(request)));
    }

    @Operation(summary = "닉네임 중복 확인",
            description = "가입에 사용할 닉네임의 사용 가능 여부를 조회합니다. 토큰 없이 호출할 수 있습니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
                            description = "조회 성공", useReturnTypeSchema = true)
            })
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @Operation(summary = "이메일 중복 확인",
            description = "가입에 사용할 이메일의 사용 가능 여부를 조회합니다. 토큰 없이 호출할 수 있습니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
                            description = "조회 성공", useReturnTypeSchema = true)
            })
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }
}
