package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.CreateRatingRequest;
import com.example.demo.dto.RatingCreateResponse;
import com.example.demo.dto.RatingResponse;
import com.example.demo.dto.UpdateRatingRequest;
import com.example.demo.service.RatingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// 로그인 전이라 memberId를 경로로 받음 (7주차에 토큰에서 꺼내는 방식으로 변경)
@RestController
@RequiredArgsConstructor
@RequestMapping("/members/{memberId}/ratings")
public class RatingController {

    private final RatingService ratingService;

    @GetMapping
    public List<RatingResponse> getMemberRatings(@PathVariable Long memberId) {
        return ratingService.getRatingsByMember(memberId);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RatingCreateResponse>> create(
            @PathVariable Long memberId,
            @Valid @RequestBody CreateRatingRequest request
    ) {
        RatingCreateResponse response = ratingService.create(memberId, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("평점 등록에 성공했습니다.", response));
    }

    @PatchMapping("/{ratingId}")
    public ApiResponse<RatingResponse> update(
            @PathVariable Long memberId,
            @PathVariable Long ratingId,
            @Valid @RequestBody UpdateRatingRequest request
    ) {
        return ApiResponse.ok("평점 수정에 성공했습니다.", ratingService.update(memberId, ratingId, request));
    }

    @DeleteMapping("/{ratingId}")
    public ResponseEntity<Void> delete(@PathVariable Long memberId, @PathVariable Long ratingId) {
        ratingService.delete(memberId, ratingId);
        return ResponseEntity.noContent().build();
    }
}
