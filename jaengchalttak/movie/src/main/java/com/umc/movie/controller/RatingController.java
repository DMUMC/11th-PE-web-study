package com.umc.movie.controller;

import com.umc.movie.dto.ApiResponse;
import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.interceptor.AuthInterceptor;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.tags.Tag;
import com.umc.movie.config.SwaggerConfig;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Tag(name = "평점")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    // 5주차에 만든 유저별 평점 조회입니다. 공개 API라 토큰을 받지 않습니다.
    @Operation(summary = "회원별 평점 조회",
            description = "지정한 회원의 공개 평점을 최신 등록 순으로 조회합니다. 토큰 없이 호출할 수 있습니다.",
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
                            description = "조회 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                            description = "COMMON4001 회원 ID 형식 오류", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                            description = "MEMBER404_1 회원 없음", content = @Content)
            })
    @GetMapping("/members/{memberId}/ratings")
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }

    // 경로에서 /members/{memberId}가 사라지고 memberId는 인터셉터가 담아둔 값을 씁니다
    @Operation(summary = "평점 등록",
            description = "로그인한 회원이 영화에 평점을 등록합니다. Bearer 토큰이 필요합니다.",
            security = @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201",
                            description = "등록 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                            description = "COMMON4001 요청 검증 실패", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
                            description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 토큰 만료", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                            description = "MEMBER404_1 회원 없음", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409",
                            description = "RATING409_1 영화 평점 중복 / COMMON4091 DB 제약 위반", content = @Content)
            })
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @RequestBody @Valid CreateRatingRequest request
    ) {
        RatingResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(201)
                .body(ApiResponse.created("평점을 등록했습니다.", response));
    }

    // 경로에서도 /{memberId}가 사라지고 인터셉터가 담아둔 값을 씁니다
    @Operation(summary = "평점 수정",
            description = "본인이 등록한 평점의 점수와 후기를 수정합니다. Bearer 토큰이 필요합니다.",
            security = @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
                            description = "수정 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                            description = "COMMON4001 요청 검증 실패", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
                            description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 토큰 만료", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403",
                            description = "RATING403_1 다른 회원의 평점", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                            description = "RATING404_1 평점 없음", content = @Content)
            })
    @PatchMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<RatingResponse>> update(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId,
            @RequestBody @Valid UpdateRatingRequest request
    ) {
        RatingResponse response = ratingService.update(memberId, ratingId, request);
        return ResponseEntity.ok(ApiResponse.ok("평점을 수정했습니다.", response));
    }

    @Operation(summary = "평점 삭제",
            description = "본인이 등록한 평점을 삭제합니다. Bearer 토큰이 필요합니다.",
            security = @SecurityRequirement(name = SwaggerConfig.BEARER_AUTH),
            responses = {
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200",
                            description = "삭제 성공", useReturnTypeSchema = true),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400",
                            description = "COMMON4001 평점 ID 형식 오류", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401",
                            description = "AUTH401_2 토큰 누락 / AUTH401_3 유효하지 않은 토큰 / AUTH401_4 토큰 만료", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403",
                            description = "RATING403_1 다른 회원의 평점", content = @Content),
                    @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404",
                            description = "RATING404_1 평점 없음", content = @Content)
            })
    @DeleteMapping("/ratings/{ratingId}")
    public ResponseEntity<ApiResponse<Void>> delete(
            @RequestAttribute(AuthInterceptor.MEMBER_ID) Long memberId,
            @PathVariable Long ratingId
    ) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.ok(ApiResponse.ok("평점을 삭제했습니다.", null));
    }
}
