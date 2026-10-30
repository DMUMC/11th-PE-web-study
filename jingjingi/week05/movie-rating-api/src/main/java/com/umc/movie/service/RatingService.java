package com.umc.movie.service;

import com.umc.movie.dto.RatingResponse;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;

    public RatingService(RatingRepository ratingRepository, MemberRepository memberRepository) {
        this.ratingRepository = ratingRepository;
        this.memberRepository = memberRepository;
    }

    @Transactional(readOnly = true)
    public List<RatingResponse> getRatingsByMember(Long memberId) {
        if (!memberRepository.existsById(memberId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 회원입니다.");
        }

        return ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId)
                .stream()
                .map(RatingResponse::from)
                .toList();
    }
}
