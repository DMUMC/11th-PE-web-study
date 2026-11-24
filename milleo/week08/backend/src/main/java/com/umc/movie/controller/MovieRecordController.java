package com.umc.movie.controller;
import com.umc.movie.dto.*;
import com.umc.movie.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
@RestController @RequiredArgsConstructor
public class MovieRecordController {
    private final MovieRecordService service;
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(@RequestAttribute("memberId") Long memberId,
            @Valid @RequestBody MovieRecordRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("COMMON201","영화 기록을 저장했습니다.",service.create(memberId,request)));
    }
}
