package com.umc.movie.controller;
import com.umc.movie.dto.*;
import com.umc.movie.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController @RequiredArgsConstructor
public class RatingController {
    private final RatingService ratingService;
    @GetMapping("/members/{memberId}/ratings")
    public ApiResponse<List<RatingResponse>> list(@PathVariable Long memberId) {
        return ApiResponse.success("COMMON200", "조회에 성공했습니다.", ratingService.getRatingsByMember(memberId));
    }
    @PostMapping("/ratings")
    public ResponseEntity<ApiResponse<RatingResponse>> create(@RequestAttribute("memberId") Long memberId,
            @Valid @RequestBody RatingCreateRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("COMMON201", "평점을 등록했습니다.", ratingService.create(memberId, request)));
    }
    @PatchMapping("/ratings/{ratingId}")
    public ApiResponse<RatingResponse> update(@RequestAttribute("memberId") Long memberId, @PathVariable Long ratingId,
            @Valid @RequestBody RatingUpdateRequest request) {
        return ApiResponse.success("COMMON200", "평점을 수정했습니다.", ratingService.update(memberId, ratingId, request));
    }
    @DeleteMapping("/ratings/{ratingId}")
    public ApiResponse<Void> delete(@RequestAttribute("memberId") Long memberId, @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ApiResponse.success("COMMON200", "평점을 삭제했습니다.", null);
    }
}
