package com.umc.movie.controller;
import com.umc.movie.dto.*;
import com.umc.movie.service.RatingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import static com.umc.movie.config.OpenApiConfig.BEARER_AUTH;
import static com.umc.movie.config.OpenApiConfig.JWT_ERRORS;

@RestController @RequiredArgsConstructor
@Tag(name = "Ratings", description = "회원 평점 조회와 JWT가 필요한 평점 작성·수정·삭제")
public class RatingController {
    private final RatingService ratingService;
    @GetMapping("/members/{memberId}/ratings")
    @Operation(summary = "회원의 평점 목록 조회", description = "토큰 없이 조회할 수 있습니다. 최신 작성순으로 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 조회 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 memberId 형식 오류"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "COMMON404 회원 없음")
    })
    public ApiResponse<List<RatingResponse>> list(@PathVariable Long memberId) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", ratingService.getRatingsByMember(memberId));
    }
    @PostMapping("/ratings")
    @Operation(summary = "평점 등록", description = "한 회원은 영화별로 평점 한 건을 등록할 수 있습니다. 점수는 정수 1~5점입니다.",
            security = @SecurityRequirement(name = BEARER_AUTH))
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 등록 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 평점 입력 오류"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = JWT_ERRORS),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 영화 평점 중복 / COMMON409 DB 제약 충돌")
    })
    public ResponseEntity<ApiResponse<RatingResponse>> create(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId,
            @Valid @RequestBody RatingCreateRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("COMMON201", "평점을 등록했습니다.", ratingService.create(memberId, request)));
    }
    @PatchMapping("/ratings/{ratingId}")
    @Operation(summary = "평점 수정", description = "작성한 회원만 점수와 후기를 수정할 수 있습니다.",
            security = @SecurityRequirement(name = BEARER_AUTH))
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 수정 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 평점 입력 또는 ratingId 형식 오류"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = JWT_ERRORS),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 작성자 본인만 수정 가능"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점 없음")
    })
    public ApiResponse<RatingResponse> update(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId, @PathVariable Long ratingId,
            @Valid @RequestBody RatingUpdateRequest request) {
        return ApiResponse.success("COMMON200", "평점을 수정했습니다.", ratingService.update(memberId, ratingId, request));
    }
    @DeleteMapping("/ratings/{ratingId}")
    @Operation(summary = "평점 삭제", description = "작성한 회원만 지울 수 있습니다. 성공 시 result는 null입니다.",
            security = @SecurityRequirement(name = BEARER_AUTH))
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 삭제 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 ratingId 형식 오류"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = JWT_ERRORS),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1 작성자 본인만 삭제 가능"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1 평점 없음")
    })
    public ApiResponse<Void> delete(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId, @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ApiResponse.success("COMMON200", "평점을 삭제했습니다.", null);
    }
}
