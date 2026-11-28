package com.umc.movie;

import com.umc.movie.dto.RatingCreateRequest;
import com.umc.movie.dto.RatingUpdateRequest;
import com.umc.movie.entity.Member;
import com.umc.movie.entity.Rating;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import com.umc.movie.service.RatingService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;
import java.util.Optional;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {
    @Mock RatingRepository ratings;
    @Mock MemberRepository members;
    @InjectMocks RatingService service;

    @Test
    @DisplayName("같은 영화에 평점을 중복 등록하면 409와 RATING409_1을 반환하고 저장하지 않는다")
    void duplicateRatingReturns409WithoutSaving() {
        // given: 회원은 존재하고 같은 영화에 이미 평점을 남겼다.
        Member member = new Member("doeyat@example.com", "hashed", "도얏");
        when(members.findById(1L)).thenReturn(Optional.of(member));
        when(ratings.existsByMember_MemberIdAndMovieId(1L, 550L)).thenReturn(true);
        var request = new RatingCreateRequest(550L, 5, "명작");

        // when / then: 예외의 HTTP 상태와 업무 코드를 함께 확인한다.
        assertThatThrownBy(() -> service.create(1L, request))
                .isInstanceOfSatisfying(ApiException.class, error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(error.getCode()).isEqualTo("RATING409_1");
                });
        verify(ratings, never()).saveAndFlush(any(Rating.class));
    }

    @Test
    @DisplayName("다른 회원의 평점을 수정하면 403과 RATING403_1을 반환하고 원본을 유지한다")
    void editingOthersRatingReturns403WithoutMutation() {
        // given: 평점 소유자는 1번, 수정 요청자는 2번 회원이다.
        Member owner = new Member("owner@example.com", "hashed", "소유자");
        ReflectionTestUtils.setField(owner, "memberId", 1L);
        Rating rating = new Rating(owner, 550L, 5, "원본 감상");
        when(ratings.findById(10L)).thenReturn(Optional.of(rating));

        // when / then
        assertThatThrownBy(() -> service.update(2L, 10L, new RatingUpdateRequest(1, "변조 시도")))
                .isInstanceOfSatisfying(ApiException.class, error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.FORBIDDEN);
                    assertThat(error.getCode()).isEqualTo("RATING403_1");
                });
        assertThat(rating.getScore()).isEqualTo(5);
        assertThat(rating.getComment()).isEqualTo("원본 감상");
        verify(ratings, never()).flush();
    }
}
