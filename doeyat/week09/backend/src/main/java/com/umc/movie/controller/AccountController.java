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
import com.umc.movie.service.AccountService;
import com.umc.movie.util.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "인증·내 정보")
@RestController @RequiredArgsConstructor
public class AccountController {
    private final AccountService accounts;
    private final JwtUtil jwtUtil;
    public record LoginResponse(String accessToken, String tokenType) {}
    @Operation(summary = "이메일 로그인", description = "공개 API. 이메일과 비밀번호로 JWT를 발급합니다. Authorize에는 accessToken 값만 넣습니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "COMMON400", value = "{\"isSuccess\": false, \"code\": \"COMMON400\", \"message\": \"입력값을 확인해 주세요.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_1", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "AUTH401_1", value = "{\"isSuccess\": false, \"code\": \"AUTH401_1\", \"message\": \"이메일 또는 비밀번호가 올바르지 않습니다.\", \"result\": null}")}))
    })
    @PostMapping("/auth/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        ProfileResponse member = accounts.login(request);
        response.setHeader("Cache-Control", "no-store");
        String token = jwtUtil.createAccessToken(member.memberId(), member.email());
        return ApiResponse.success("COMMON200", "로그인에 성공했습니다.", new LoginResponse(token,"Bearer"));
    }
    @Operation(summary = "내 정보 조회", description = "토큰 필요. JWT의 회원 ID에 해당하는 내 정보를 조회합니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 / AUTH401_3 / AUTH401_4", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "AUTH401_2", value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"로그인이 필요한 요청입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_3", value = "{\"isSuccess\": false, \"code\": \"AUTH401_3\", \"message\": \"유효하지 않은 토큰입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_4", value = "{\"isSuccess\": false, \"code\": \"AUTH401_4\", \"message\": \"만료된 토큰입니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "MEMBER404_1", value = "{\"isSuccess\": false, \"code\": \"MEMBER404_1\", \"message\": \"해당 회원을 찾을 수 없습니다.\", \"result\": null}")}))
    })
    @GetMapping("/members/me")
    public ApiResponse<ProfileResponse> me(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", accounts.me(memberId));
    }
    @Operation(summary = "내 정보 수정", description = "토큰 필요. 내 이메일·닉네임·소개를 수정합니다. nickname은 필수이고 생략한 email과 introduction은 유지합니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "COMMON400", value = "{\"isSuccess\": false, \"code\": \"COMMON400\", \"message\": \"입력값을 확인해 주세요.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 / AUTH401_3 / AUTH401_4", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "AUTH401_2", value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"로그인이 필요한 요청입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_3", value = "{\"isSuccess\": false, \"code\": \"AUTH401_3\", \"message\": \"유효하지 않은 토큰입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_4", value = "{\"isSuccess\": false, \"code\": \"AUTH401_4\", \"message\": \"만료된 토큰입니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "MEMBER404_1", value = "{\"isSuccess\": false, \"code\": \"MEMBER404_1\", \"message\": \"해당 회원을 찾을 수 없습니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "MEMBER4091 / MEMBER409_1 / COMMON409", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "MEMBER4091", value = "{\"isSuccess\": false, \"code\": \"MEMBER4091\", \"message\": \"이미 사용 중인 이메일입니다.\", \"result\": null}"), @ExampleObject(name = "MEMBER409_1", value = "{\"isSuccess\": false, \"code\": \"MEMBER409_1\", \"message\": \"이미 사용 중인 닉네임입니다.\", \"result\": null}"), @ExampleObject(name = "COMMON409", value = "{\"isSuccess\": false, \"code\": \"COMMON409\", \"message\": \"데이터 제약 조건 충돌\", \"result\": null}")}))
    })
    @PatchMapping("/members/me")
    public ApiResponse<ProfileResponse> update(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId,
                                              @Valid @RequestBody ProfileUpdateRequest request) {
        return ApiResponse.success("COMMON200", "정보를 수정했습니다.", accounts.update(memberId,request));
    }
}
