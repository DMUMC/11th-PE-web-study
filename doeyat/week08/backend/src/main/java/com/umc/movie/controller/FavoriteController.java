package com.umc.movie.controller;
import com.umc.movie.dto.*;
import com.umc.movie.service.FavoriteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.*;
@RestController @RequiredArgsConstructor
@RequestMapping("/favorites")
public class FavoriteController {
 private final FavoriteService service;
 @PostMapping public ResponseEntity<ApiResponse<FavoriteResponse>> create(@RequestAttribute("memberId") Long memberId,@Valid @RequestBody FavoriteRequest body) {
  return ResponseEntity.status(201).body(ApiResponse.success("COMMON201","즐겨찾기를 변경했습니다.",service.create(memberId,body.movieId())));
 }
 @GetMapping public ApiResponse<List<FavoriteResponse>> list(@RequestAttribute("memberId") Long memberId) { return ApiResponse.success("COMMON200","조회했습니다.",service.list(memberId)); }
 @GetMapping("/{movieId}") public ApiResponse<Map<String,Object>> contains(@RequestAttribute("memberId") Long memberId,@PathVariable Long movieId) { return ApiResponse.success("COMMON200","조회했습니다.",Map.of("movieId",movieId,"isFavorite",service.contains(memberId,movieId))); }
 @DeleteMapping("/{movieId}") public ApiResponse<Void> delete(@RequestAttribute("memberId") Long memberId,@PathVariable Long movieId) { service.delete(memberId,movieId);return ApiResponse.success("COMMON200","즐겨찾기를 변경했습니다.",null); }
}
