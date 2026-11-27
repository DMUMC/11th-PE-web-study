package com.umc.movie.controller;
import com.umc.movie.dto.*;
import com.umc.movie.service.FavoriteService;
import com.umc.movie.exception.ApiException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import static com.umc.movie.config.OpenApiConfig.BEARER_AUTH;
import static com.umc.movie.config.OpenApiConfig.JWT_ERRORS;

@RestController @RequestMapping("/favorites") @RequiredArgsConstructor
@Tag(name = "Favorites", description = "JWT가 필요한 회원별 즐겨찾기 API")
@SecurityRequirement(name = BEARER_AUTH)
public class FavoriteController {
    private final FavoriteService service;
    public record FavoriteStatus(boolean isFavorite) {}
    @PostMapping
    @Operation(summary = "즐겨찾기 등록", description = "회원의 즐겨찾기에 영화를 등록합니다. 동일 회원이 같은 영화를 다시 등록하면 409를 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "COMMON201 즐겨찾기 등록 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 movieId 누락 또는 양의 정수 아님"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = JWT_ERRORS),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "MEMBER404_1 회원 없음"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "409", description = "FAVORITE409_1 즐겨찾기 중복 / COMMON409 DB 제약 충돌")
    })
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId,
            @Valid @RequestBody FavoriteCreateRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("COMMON201","즐겨찾기를 등록했습니다.",service.create(memberId,request.movieId())));
    }
    @GetMapping
    @Operation(summary = "내 즐겨찾기 목록 조회", description = "최신 등록순으로 조회합니다. 등록한 영화가 없으면 빈 배열을 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 목록 조회 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = JWT_ERRORS)
    })
    public ApiResponse<List<FavoriteResponse>> list(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId) {
        return ApiResponse.success("COMMON200","즐겨찾기 목록을 조회했습니다.",service.list(memberId));
    }
    @GetMapping("/{movieId}")
    @Operation(summary = "즐겨찾기 여부 조회", description = "해당 영화의 등록 여부를 result.isFavorite로 반환합니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 등록 여부 조회 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 movieId가 양의 정수 아님"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = JWT_ERRORS)
    })
    public ApiResponse<FavoriteStatus> exists(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId,@PathVariable Long movieId) {
        positive(movieId);
        return ApiResponse.success("COMMON200","즐겨찾기 여부를 조회했습니다.",new FavoriteStatus(service.exists(memberId,movieId)));
    }
    @DeleteMapping("/{movieId}")
    @Operation(summary = "즐겨찾기 해제", description = "해당 영화를 내 목록에서 제거합니다. 성공 시 result는 null입니다.")
    @ApiResponses({
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "COMMON200 즐겨찾기 해제 완료", useReturnTypeSchema = true),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "COMMON400 movieId가 양의 정수 아님"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "401", description = JWT_ERRORS),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "FAVORITE404_1 등록된 즐겨찾기 없음")
    })
    public ApiResponse<Void> delete(@Parameter(hidden = true) @RequestAttribute("memberId") Long memberId,@PathVariable Long movieId) {
        positive(movieId); service.delete(memberId,movieId);
        return ApiResponse.success("COMMON200","즐겨찾기를 해제했습니다.",null);
    }
    private void positive(Long movieId) {
        if(movieId<=0) throw new ApiException(HttpStatus.BAD_REQUEST,"COMMON400","movieId는 양수여야 합니다.");
    }
}
