package com.umc.movie.controller;

import com.umc.movie.config.SwaggerConfig;
import com.umc.movie.dto.*;
import com.umc.movie.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.umc.movie.interceptor.AuthInterceptor;

@Tag(name = "회원", description = "회원가입, 중복 확인, 내 정보 조회·수정 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {
    private final MemberService memberService;

    @Operation(
            summary = "닉네임 중복 확인 (토큰 불필요)",
            description = "닉네임을 사용할 수 있는지 확인합니다. 공개 API입니다."
    )
    @GetMapping("/nickname/{nickname}")
    public NicknameCheckResponse checkNickname(@PathVariable String nickname) {
        return memberService.checkNickname(nickname);
    }

    @Operation(
            summary = "이메일 중복 확인 (토큰 불필요)",
            description = "이메일을 사용할 수 있는지 확인합니다. 공개 API입니다."
    )
    @GetMapping("/email/{email}")
    public EmailCheckResponse checkEmail(@PathVariable String email) {
        return memberService.checkEmail(email);
    }

    @Operation(
            summary = "회원가입 (토큰 불필요)",
            description = "이메일, 비밀번호, 닉네임으로 회원을 등록합니다. 토큰이 없어도 호출할 수 있는 공개 API입니다."
    )
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201: 회원가입 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001: 비밀번호 규칙 등 검증 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "COMMON4092: 이미 사용 중인 이메일 또는 닉네임")
    })
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signUp(
            @Valid @RequestBody SignUpRequest request
    ) {
        MemberResponse response = memberService.signUp(request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("회원가입에 성공했습니다.", response));
    }

    @Operation(
            summary = "내 정보 조회 (토큰 필요)",
            description = "로그인한 회원 본인의 정보를 조회합니다. Authorization 헤더의 Bearer 토큰이 필요합니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 조회 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 없음")
    })
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> getMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        MemberInfoResponse response = memberService.getMyInfo(memberId);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 조회했습니다.", response));
    }

    @Operation(
            summary = "내 정보 수정 (토큰 필요)",
            description = "로그인한 회원 본인의 정보를 수정합니다. Authorization 헤더의 Bearer 토큰이 필요합니다."
    )
    @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200: 수정 성공"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON4001: 검증 실패"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2: 토큰 없음")
    })
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<MemberInfoResponse>> updateMyInfo(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid MemberUpdateRequest request
    ) {
        MemberInfoResponse response = memberService.updateMyInfo(memberId, request);
        return ResponseEntity.ok(ApiResponse.ok("회원 정보를 수정했습니다.", response));
    }
}