package com.umc.movie.controller;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;

import com.umc.movie.dto.*;
import com.umc.movie.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@Tag(name = "회원")
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {
    private final MemberService memberService;
    @Operation(summary = "회원가입", description = "공개 API. 이메일·닉네임 중복을 검사하고 비밀번호를 해싱해 저장합니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "COMMON400", value = "{\"isSuccess\": false, \"code\": \"COMMON400\", \"message\": \"입력값을 확인해 주세요.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER4091 / MEMBER4092 / COMMON409", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "MEMBER4091", value = "{\"isSuccess\": false, \"code\": \"MEMBER4091\", \"message\": \"이미 사용 중인 이메일입니다.\", \"result\": null}"), @ExampleObject(name = "MEMBER4092", value = "{\"isSuccess\": false, \"code\": \"MEMBER4092\", \"message\": \"이미 사용 중인 닉네임입니다.\", \"result\": null}"), @ExampleObject(name = "COMMON409", value = "{\"isSuccess\": false, \"code\": \"COMMON409\", \"message\": \"데이터 제약 조건 충돌\", \"result\": null}")}))
    })
    @PostMapping
    public ResponseEntity<ApiResponse<MemberResponse>> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("COMMON201", "회원가입에 성공했습니다.", memberService.signup(request)));
    }
    @Operation(summary = "닉네임 중복 확인", description = "공개 API. available이 true이면 사용 가능한 닉네임입니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공")
    })
    @GetMapping("/nickname/{nickname}")
    public ApiResponse<NicknameCheckResponse> checkNickname(@PathVariable String nickname) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", memberService.checkNickname(nickname));
    }
    @Operation(summary = "이메일 중복 확인", description = "공개 API. available이 true이면 사용 가능한 이메일입니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공")
    })
    @GetMapping("/email/{email}")
    public ApiResponse<EmailCheckResponse> checkEmail(@PathVariable String email) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", memberService.checkEmail(email));
    }
}
