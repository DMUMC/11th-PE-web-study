package com.example.demo.controller;

import com.example.demo.auth.LoginMember;
import com.example.demo.auth.LoginRequired;
import com.example.demo.common.response.ApiResponse;
import com.example.demo.dto.CreateMovieRecordRequest;
import com.example.demo.dto.MovieRecordResponse;
import com.example.demo.service.MovieRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MovieRecordController {

    private final MovieRecordService movieRecordService;

    @LoginRequired
    @PostMapping("/movie-records")
    public ResponseEntity<ApiResponse<MovieRecordResponse>> create(
            @LoginMember Long memberId,
            @Valid @RequestBody CreateMovieRecordRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.created("영화 기록을 저장했습니다.", movieRecordService.create(memberId, request)));
    }
}
