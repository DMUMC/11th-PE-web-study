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
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Tag(name = "즐겨찾기")
@RestController @RequiredArgsConstructor
@RequestMapping("/favorites")
public class FavoriteController {
    private final FavoriteService favorites;
    public record FavoriteStatusResponse(boolean isFavorite) {}

    @Operation(summary = "즐겨찾기 등록", description = "토큰 필요. 내 계정에 영화를 즐겨찾기합니다. 동일 영화의 중복 등록은 409입니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "COMMON400", value = "{\"isSuccess\": false, \"code\": \"COMMON400\", \"message\": \"movieId는 양의 정수여야 합니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 / AUTH401_3 / AUTH401_4", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "AUTH401_2", value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"로그인이 필요한 요청입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_3", value = "{\"isSuccess\": false, \"code\": \"AUTH401_3\", \"message\": \"유효하지 않은 토큰입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_4", value = "{\"isSuccess\": false, \"code\": \"AUTH401_4\", \"message\": \"만료된 토큰입니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "MEMBER404_1", value = "{\"isSuccess\": false, \"code\": \"MEMBER404_1\", \"message\": \"해당 회원을 찾을 수 없습니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "FAVORITE409_1 / COMMON409", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "FAVORITE409_1", value = "{\"isSuccess\": false, \"code\": \"FAVORITE409_1\", \"message\": \"이미 즐겨찾기한 영화입니다.\", \"result\": null}"), @ExampleObject(name = "COMMON409", value = "{\"isSuccess\": false, \"code\": \"COMMON409\", \"message\": \"데이터 제약 조건 충돌\", \"result\": null}")}))
    })
    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId,
            @Valid @RequestBody CreateFavoriteRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("COMMON201", "즐겨찾기를 등록했습니다.", favorites.create(memberId, request.movieId())));
    }
    @Operation(summary = "내 즐겨찾기 조회", description = "토큰 필요. 내 즐겨찾기를 최신 등록순으로 조회합니다. 결과가 없으면 빈 배열입니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 / AUTH401_3 / AUTH401_4", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "AUTH401_2", value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"로그인이 필요한 요청입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_3", value = "{\"isSuccess\": false, \"code\": \"AUTH401_3\", \"message\": \"유효하지 않은 토큰입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_4", value = "{\"isSuccess\": false, \"code\": \"AUTH401_4\", \"message\": \"만료된 토큰입니다.\", \"result\": null}")}))
    })
    @GetMapping
    public ApiResponse<List<FavoriteResponse>> list(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", favorites.list(memberId));
    }
    @Operation(summary = "즐겨찾기 여부 조회", description = "토큰 필요. 즐겨찾기하지 않은 영화도 200과 isFavorite false를 반환합니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 / AUTH401_3 / AUTH401_4", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "AUTH401_2", value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"로그인이 필요한 요청입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_3", value = "{\"isSuccess\": false, \"code\": \"AUTH401_3\", \"message\": \"유효하지 않은 토큰입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_4", value = "{\"isSuccess\": false, \"code\": \"AUTH401_4\", \"message\": \"만료된 토큰입니다.\", \"result\": null}")}))
    })
    @GetMapping("/{movieId}")
    public ApiResponse<FavoriteStatusResponse> status(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId, @PathVariable Long movieId) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", new FavoriteStatusResponse(favorites.status(memberId, movieId)));
    }
    @Operation(summary = "즐겨찾기 해제", description = "토큰 필요. 내 즐겨찾기에서 영화 ID로 해제합니다.")
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponses({
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 — 성공"),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = "AUTH401_2 / AUTH401_3 / AUTH401_4", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "AUTH401_2", value = "{\"isSuccess\": false, \"code\": \"AUTH401_2\", \"message\": \"로그인이 필요한 요청입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_3", value = "{\"isSuccess\": false, \"code\": \"AUTH401_3\", \"message\": \"유효하지 않은 토큰입니다.\", \"result\": null}"), @ExampleObject(name = "AUTH401_4", value = "{\"isSuccess\": false, \"code\": \"AUTH401_4\", \"message\": \"만료된 토큰입니다.\", \"result\": null}")})),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "FAVORITE404_1", content = @Content(mediaType = "application/json", schema = @Schema(implementation = com.umc.movie.dto.ApiResponse.class), examples = {@ExampleObject(name = "FAVORITE404_1", value = "{\"isSuccess\": false, \"code\": \"FAVORITE404_1\", \"message\": \"즐겨찾기하지 않은 영화입니다.\", \"result\": null}")}))
    })
    @DeleteMapping("/{movieId}")
    public ApiResponse<Void> delete(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId, @PathVariable Long movieId) {
        favorites.delete(memberId, movieId);
        return ApiResponse.success("COMMON200", "즐겨찾기를 해제했습니다.", null);
    }
}
