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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

    @Mock
    private RatingRepository ratingRepository;

    @Mock
    private MemberRepository memberRepository;

    @InjectMocks
    private RatingService ratingService;

    // 회원 번호는 DB가 정하는 값이라 빌더에 없어서 테스트에서만 직접 넣는다.
    private Member member(Long memberId, String nickname) {
        Member member = Member.builder()
                .email(nickname + "@umc.com")
                .password("암호화된비밀번호")
                .nickname(nickname)
                .build();
        ReflectionTestUtils.setField(member, "memberId", memberId);
        return member;
    }

    @Test
    @DisplayName("같은 영화에 평점을 다시 등록하면 RATING409_1 예외를 던지고 저장하지 않는다")
    void createRatingWhenDuplicated() {
        // given: 1번 회원이 550번 영화에 이미 평점을 남겼다
        given(memberRepository.findById(1L)).willReturn(Optional.of(member(1L, "영화조아")));
        given(ratingRepository.existsByMember_MemberIdAndMovieId(1L, 550L)).willReturn(true);

        // when & then
        assertThatThrownBy(() -> ratingService.create(1L, new CreateRatingRequest(550L, 5, "또 남기기")))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("code", "RATING409_1")
                .hasFieldOrPropertyWithValue("status", HttpStatus.CONFLICT);

        verify(ratingRepository, never()).saveAndFlush(any(Rating.class));
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하면 RATING403_1 예외를 던지고 평점은 그대로 둔다")
    void updateOthersRating() {
        // given: 10번 평점의 주인은 2번 회원이다
        Rating othersRating = Rating.builder()
                .member(member(2L, "다른회원"))
                .movieId(550L)
                .score(3)
                .comment("원래 후기")
                .build();
        given(ratingRepository.findById(10L)).willReturn(Optional.of(othersRating));

        // when & then: 1번 회원이 수정하려 하면 막힌다
        assertThatThrownBy(() -> ratingService.update(1L, 10L, new UpdateRatingRequest(1, "바꾼 후기")))
                .isInstanceOf(ApiException.class)
                .hasFieldOrPropertyWithValue("code", "RATING403_1")
                .hasFieldOrPropertyWithValue("status", HttpStatus.FORBIDDEN);

        assertThat(othersRating.getScore()).isEqualTo(3);
        assertThat(othersRating.getComment()).isEqualTo("원래 후기");
        verify(ratingRepository, never()).saveAndFlush(any(Rating.class));
    }
}
