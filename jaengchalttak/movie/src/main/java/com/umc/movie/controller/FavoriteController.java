package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateFavoriteRequest;
import com.umc.movie.dto.FavoriteResponse;
import com.umc.movie.dto.FavoriteStatusResponse;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@Tag(name = "즐겨찾기")
@SecurityRequirement(name = SwaggerConfig.BEARER_AUTH)
@RequiredArgsConstructor
public class FavoriteController {

    private final FavoriteService favoriteService;

    @Operation(summary = "즐겨찾기 등록",
            description = "로그인한 회원의 즐겨찾기에 TMDB 영화를 추가합니다. Bearer 토큰이 필요합니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201",
                            description = "등록 성공",
                            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                                    {"isSuccess":true,"code":"COMMON201","message":"즐겨찾기를 등록했습니다.","result":{"favoriteId":1,"movieId":550,"createdAt":"2026-09-13T21:00:00"}}
                                    """))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                            description = "COMMON4001 영화 ID 검증 실패", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
                            description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 토큰 만료",
                            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                                    {"isSuccess":false,"code":"AUTH401_2","message":"로그인이 필요한 요청입니다.","result":null}
                                    """))),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                            description = "MEMBER404_1 회원 없음", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409",
                            description = "FAVORITE409_1 즐겨찾기 중복 / COMMON4091 DB 제약 위반",
                            content = @Content(mediaType = "application/json", examples = @ExampleObject(value = """
                                    {"isSuccess":false,"code":"FAVORITE409_1","message":"이미 이 영화를 즐겨찾기하셨습니다.","result":null}
                                    """)))
            })
    @PostMapping("/favorites")
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateFavoriteRequest request
    ) {
        FavoriteResponse response = favoriteService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", response));
    }

    @Operation(summary = "내 즐겨찾기 조회",
            description = "로그인한 회원의 즐겨찾기를 최신 등록 순으로 조회합니다. Bearer 토큰이 필요합니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
                            description = "조회 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
                            description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 토큰 만료", content = @Content)
            })
    @GetMapping("/favorites")
    public ResponseEntity<ApiResponse<List<FavoriteResponse>>> getMyFavorites(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId
    ) {
        List<FavoriteResponse> response = favoriteService.getMyFavorites(memberId);
        return ResponseEntity.ok(ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 여부 조회",
            description = "로그인한 회원이 특정 영화를 즐겨찾기했는지 조회합니다. Bearer 토큰이 필요합니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
                            description = "조회 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                            description = "COMMON4001 영화 ID 형식 오류", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
                            description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 토큰 만료", content = @Content)
            })
    @GetMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<FavoriteStatusResponse>> getStatus(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        FavoriteStatusResponse response = favoriteService.getStatus(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", response));
    }

    @Operation(summary = "즐겨찾기 해제",
            description = "로그인한 회원의 특정 영화 즐겨찾기를 해제합니다. Bearer 토큰이 필요합니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
                            description = "해제 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                            description = "COMMON4001 영화 ID 형식 오류", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
                            description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 토큰 만료", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                            description = "FAVORITE404_1 즐겨찾기 없음", content = @Content)
            })
    @DeleteMapping("/favorites/{movieId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ResponseEntity.ok(ApiResponse.ok("즐겨찾기를 해제했습니다.", null));
    }
}
