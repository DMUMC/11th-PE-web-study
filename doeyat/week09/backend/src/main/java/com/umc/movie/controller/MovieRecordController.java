package com.umc.movie.controller;
import com.umc.movie.dto.*;
import com.umc.movie.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
@RestController @RequiredArgsConstructor
public class MovieRecordController {
 private final MovieRecordService service;
 @io.swagger.v3.oas.annotations.Operation(summary="평점과 즐겨찾기 동시 저장", description="JWT 회원의 영화 기록을 하나의 트랜잭션으로 저장합니다.", security=@io.swagger.v3.oas.annotations.security.SecurityRequirement(name="bearerAuth"))
 @PostMapping("/movie-records") public ResponseEntity<ApiResponse<MovieRecordService.Result>> create(@io.swagger.v3.oas.annotations.Parameter(hidden=true) @RequestAttribute("memberId") Long memberId,@Valid @RequestBody MovieRecordRequest body) {
  return ResponseEntity.status(201).body(ApiResponse.success("COMMON201","변경 사항을 저장했습니다.",service.create(memberId,body)));
 }
}
