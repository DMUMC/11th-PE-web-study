package com.umc.movie.controller;
import com.umc.movie.dto.*;
import com.umc.movie.service.FavoriteService;
import com.umc.movie.exception.ApiException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequestMapping("/favorites") @RequiredArgsConstructor
public class FavoriteController {
    private final FavoriteService service;
    public record FavoriteStatus(boolean isFavorite) {}
    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(@RequestAttribute("memberId") Long memberId,
            @Valid @RequestBody FavoriteCreateRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("COMMON201","즐겨찾기를 등록했습니다.",service.create(memberId,request.movieId())));
    }
    @GetMapping
    public ApiResponse<List<FavoriteResponse>> list(@RequestAttribute("memberId") Long memberId) {
        return ApiResponse.success("COMMON200","즐겨찾기 목록을 조회했습니다.",service.list(memberId));
    }
    @GetMapping("/{movieId}")
    public ApiResponse<FavoriteStatus> exists(@RequestAttribute("memberId") Long memberId,@PathVariable Long movieId) {
        positive(movieId);
        return ApiResponse.success("COMMON200","즐겨찾기 여부를 조회했습니다.",new FavoriteStatus(service.exists(memberId,movieId)));
    }
    @DeleteMapping("/{movieId}")
    public ApiResponse<Void> delete(@RequestAttribute("memberId") Long memberId,@PathVariable Long movieId) {
        positive(movieId); service.delete(memberId,movieId);
        return ApiResponse.success("COMMON200","즐겨찾기를 해제했습니다.",null);
    }
    private void positive(Long movieId) {
        if(movieId<=0) throw new ApiException(HttpStatus.BAD_REQUEST,"COMMON400","movieId는 양수여야 합니다.");
    }
}
