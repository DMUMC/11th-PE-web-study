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
 @PostMapping("/movie-records") public ResponseEntity<ApiResponse<MovieRecordService.Result>> create(@RequestAttribute("memberId") Long memberId,@Valid @RequestBody MovieRecordRequest body) {
  return ResponseEntity.status(201).body(ApiResponse.success("COMMON201","변경 사항을 저장했습니다.",service.create(memberId,body)));
 }
}
