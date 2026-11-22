package com.example.demo.controller;

import com.example.demo.auth.LoginMember;
import com.example.demo.auth.LoginRequired;
import com.example.demo.common.response.ApiResponse;
import com.example.demo.dto.CreateFavoriteRequest;
import com.example.demo.dto.FavoriteResponse;
import com.example.demo.dto.FavoriteStatusResponse;
import com.example.demo.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// 모든 즐겨찾기 API는 로그인 필요. memberId는 토큰에서만 꺼냄
@LoginRequired
@RestController
@RequiredArgsConstructor
@RequestMapping("/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    @PostMapping
    public ResponseEntity<ApiResponse<FavoriteResponse>> create(
            @LoginMember Long memberId,
            @Valid @RequestBody CreateFavoriteRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("즐겨찾기를 등록했습니다.", favoriteService.create(memberId, request)));
    }

    @GetMapping
    public ApiResponse<List<FavoriteResponse>> getMyFavorites(@LoginMember Long memberId) {
        return ApiResponse.ok("내 즐겨찾기 목록을 조회했습니다.", favoriteService.getMyFavorites(memberId));
    }

    @GetMapping("/{movieId}")
    public ApiResponse<FavoriteStatusResponse> getStatus(
            @LoginMember Long memberId,
            @PathVariable("movieId") Long movieId
    ) {
        return ApiResponse.ok("즐겨찾기 여부를 조회했습니다.", favoriteService.getStatus(memberId, movieId));
    }

    @DeleteMapping("/{movieId}")
    public ApiResponse<Void> delete(
            @LoginMember Long memberId,
            @PathVariable("movieId") Long movieId
    ) {
        favoriteService.delete(memberId, movieId);
        return ApiResponse.ok("즐겨찾기를 해제했습니다.", null);
    }
}
