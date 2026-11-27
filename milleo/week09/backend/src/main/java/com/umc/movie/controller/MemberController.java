package com.umc.movie.controller;
import com.umc.movie.dto.*;
import com.umc.movie.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
@Tag(name = "Members", description = "토큰 없이 사용할 수 있는 회원 API")
public class MemberController {
    private final MemberService memberService;
    @PostMapping
    @Operation(summary = "회원가입", description = "Access token 없이 새 회원을 등록합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 회원가입 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 가입 입력 오류"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER4091 이메일 중복 / MEMBER4092 닉네임 중복 / COMMON409 DB 제약 충돌")
    })
    public ResponseEntity<ApiResponse<MemberResponse>> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("COMMON201", "회원가입에 성공했습니다.", memberService.signup(request)));
    }
    @GetMapping("/nickname/{nickname}")
    @Operation(summary = "닉네임 중복 확인")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 조회 완료", useReturnTypeSchema = true)
    public ApiResponse<NicknameCheckResponse> checkNickname(@PathVariable String nickname) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", memberService.checkNickname(nickname));
    }
    @GetMapping("/email/{email}")
    @Operation(summary = "이메일 중복 확인")
    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 조회 완료", useReturnTypeSchema = true)
    public ApiResponse<EmailCheckResponse> checkEmail(@PathVariable String email) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", memberService.checkEmail(email));
    }
}
