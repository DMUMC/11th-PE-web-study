package com.umc.movie.service;

import com.umc.movie.dto.CreateRatingRequest;
import com.umc.movie.dto.UpdateRatingRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    @Test
    @DisplayName("같은 영화에 평점을 중복 등록하면 409와 RATING409_1을 반환한다")
    void createRatingWhenMovieAlreadyRated() {
        Member member = Member.builder()
                .email("challenger@umc.com")
                .password("hashed-password")
                .nickname("영화조아")
                .build();
        given(memberRepository.findById(1L)).willReturn(Optional.of(member));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 5, "좋아요")))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(exception.getCode()).isEqualTo("RATING409_1");
                });
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하려 하면 403과 RATING403_1을 반환한다")
    void updateRatingWhenNotOwner() {
        Member owner = Member.builder()
                .email("owner@umc.com")
                .password("hashed-password")
                .nickname("작성자")
                .build();
        ReflectionTestUtils.setField(owner, "memberId", 2L);
        Rating rating = Rating.builder()
                .member(owner)
                .movieId(550L)
                .score(4)
                .comment("좋아요")
                .build();
        given(ratingRepository.findById(10L)).willReturn(Optional.of(rating));

        assertThatThrownBy(() -> ratingService.update(1L, 10L, new UpdateRatingRequest(5, "수정")))
                .isInstanceOfSatisfying(ApiException.class, exception -> {
                    assertThat(exception.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(exception.getCode()).isEqualTo("RATING403_1");
                });
    }
}
