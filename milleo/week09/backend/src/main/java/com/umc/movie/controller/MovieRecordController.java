package com.umc.movie.controller;
import com.umc.movie.dto.*;
import com.umc.movie.service.MovieRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static com.umc.movie.config.OpenApiConfig.BEARER_AUTH;
import static com.umc.movie.config.OpenApiConfig.JWT_ERRORS;

@RestController @RequiredArgsConstructor
@Tag(name = "Movie Records", description = "평점과 즐겨찾기를 함께 저장하는 API")
public class MovieRecordController {
    private final MovieRecordService service;
    @PostMapping("/movie-records")
    @Operation(summary = "영화 기록 등록", description = "평점을 등록합니다. addToFavorites가 true이면 즐겨찾기까지 같은 트랜잭션에서 저장합니다.",
            security = @SecurityRequirement(name = BEARER_AUTH))
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 영화 기록 저장 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 영화 기록 입력 오류"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = JWT_ERRORS),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 평점 중복 / FAVORITE409_1 즐겨찾기 중복 / COMMON409 DB 제약 충돌")
    })
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId,
            @Valid @RequestBody MovieRecordRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("COMMON201","영화 기록을 저장했습니다.",service.create(memberId,request)));
    }
}
