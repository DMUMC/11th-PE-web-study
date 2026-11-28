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
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@Tag(name = "평점")
@RestController @RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;
    @Operation(summary = "유저별 평점 조회", description = "공개 API. 지정한 회원의 평점을 최신순으로 조회합니다.")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "COMMON404", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "COMMON404", value = "{\"isSuccess\": false, \"code\": \"COMMON404\", \"message\": \"존재하지 않는 유저입니다.\", \"result\": null}")}))
    })
    @GetMapping("/members/{memberId}/ratings")
    public ApiResponse<List<RatingResponse>> list(@PathVariable Long memberId) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", ratingService.getRatingsByMember(memberId));
    }
    @Operation(summary = "평점 등록", description = "토큰 필요. 로그인한 회원의 영화 평점을 등록합니다. 같은 영화에 중복 등록할 수 없습니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "COMMON400", value = "{\"isSuccess\": false, \"code\": \"COMMON400\", \"message\": \"score는 1~5 정수여야 합니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 / AUTH401_3 / AUTH401_4", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "AUTH401_2", value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"로그인이 필요한 요청입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_3", value = "{\"isSuccess\": false, \"code\": \"AUTH401_3\", \"message\": \"유효하지 않은 토큰입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_4", value = "{\"isSuccess\": false, \"code\": \"AUTH401_4\", \"message\": \"만료된 토큰입니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "MEMBER404_1", value = "{\"isSuccess\": false, \"code\": \"MEMBER404_1\", \"message\": \"해당 회원을 찾을 수 없습니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "RATING409_1 / COMMON409", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "RATING409_1", value = "{\"isSuccess\": false, \"code\": \"RATING409_1\", \"message\": \"이미 이 영화에 평점을 남기셨습니다.\", \"result\": null}"), @ExampleObject(name = "COMMON409", value = "{\"isSuccess\": false, \"code\": \"COMMON409\", \"message\": \"데이터 제약 조건 충돌\", \"result\": null}")}))
    })
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId,
            @Valid @RequestBody RatingCreateRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("COMMON201", "평점을 등록했습니다.", ratingService.create(memberId, request)));
    }
    @Operation(summary = "평점 수정", description = "토큰 필요. 본인이 작성한 평점만 수정할 수 있습니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "COMMON400", value = "{\"isSuccess\": false, \"code\": \"COMMON400\", \"message\": \"입력값을 확인해 주세요.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 / AUTH401_3 / AUTH401_4", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "AUTH401_2", value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"로그인이 필요한 요청입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_3", value = "{\"isSuccess\": false, \"code\": \"AUTH401_3\", \"message\": \"유효하지 않은 토큰입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_4", value = "{\"isSuccess\": false, \"code\": \"AUTH401_4\", \"message\": \"만료된 토큰입니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "RATING403_1", value = "{\"isSuccess\": false, \"code\": \"RATING403_1\", \"message\": \"본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "RATING404_1", value = "{\"isSuccess\": false, \"code\": \"RATING404_1\", \"message\": \"해당 평점을 찾을 수 없습니다.\", \"result\": null}")}))
    })
    @PatchMapping("/ratings/{ratingId}")
    public ApiResponse<RatingResponse> update(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId, @PathVariable Long ratingId,
            @Valid @RequestBody RatingUpdateRequest request) {
        return ApiResponse.success("COMMON200", "평점을 수정했습니다.", ratingService.update(memberId, ratingId, request));
    }
    @Operation(summary = "평점 삭제", description = "토큰 필요. 본인의 평점을 삭제하며 200과 COMMON200을 반환합니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 / AUTH401_3 / AUTH401_4", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "AUTH401_2", value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"로그인이 필요한 요청입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_3", value = "{\"isSuccess\": false, \"code\": \"AUTH401_3\", \"message\": \"유효하지 않은 토큰입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_4", value = "{\"isSuccess\": false, \"code\": \"AUTH401_4\", \"message\": \"만료된 토큰입니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "RATING403_1", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "RATING403_1", value = "{\"isSuccess\": false, \"code\": \"RATING403_1\", \"message\": \"본인이 작성한 평점만 수정하거나 삭제할 수 있습니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "RATING404_1", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "RATING404_1", value = "{\"isSuccess\": false, \"code\": \"RATING404_1\", \"message\": \"해당 평점을 찾을 수 없습니다.\", \"result\": null}")}))
    })
    @DeleteMapping("/ratings/{ratingId}")
    public ApiResponse<Void> delete(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId, @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ApiResponse.success("COMMON200", "평점을 삭제했습니다.", null);
    }
}
