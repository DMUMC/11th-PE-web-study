package com.example.demo.service;

import com.example.demo.common.exception.ErrorStatus;
import com.example.demo.common.exception.GeneralException;
import com.example.demo.dto.CreateFavoriteRequest;
import com.example.demo.dto.FavoriteResponse;
import com.example.demo.dto.FavoriteStatusResponse;
import com.example.demo.entity.Favorite;
import com.example.demo.entity.Member;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public FavoriteResponse create(Long memberId, CreateFavoriteRequest request) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.MEMBER_NOT_FOUND));

        // 사전 검사: 명확한 오류 코드(FAVORITE409_1)를 주기 위함. 동시 요청은 DB UNIQUE가 막음
        if (favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, request.getMovieId())) {
            throw new GeneralException(ErrorStatus.FAVORITE_DUPLICATED);
        }

        Favorite favorite = Favorite.builder()
                .member(member)
                .movieId(request.getMovieId())
                .build();

        return FavoriteResponse.from(favoriteRepository.save(favorite));
    }

    @Transactional(readOnly = true)
    public List<FavoriteResponse> getMyFavorites(Long memberId) {
        return favoriteRepository.findByMember_MemberIdOrderByFavoriteIdDesc(memberId).stream()
                .map(FavoriteResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public FavoriteStatusResponse getStatus(Long memberId, Long movieId) {
        return new FavoriteStatusResponse(
                favoriteRepository.existsByMember_MemberIdAndMovieId(memberId, movieId)
        );
    }

    @Transactional
    public void delete(Long memberId, Long movieId) {
        Favorite favorite = favoriteRepository.findByMember_MemberIdAndMovieId(memberId, movieId)
                .orElseThrow(() -> new GeneralException(ErrorStatus.FAVORITE_NOT_FOUND));

        favoriteRepository.delete(favorite);
    }
}
