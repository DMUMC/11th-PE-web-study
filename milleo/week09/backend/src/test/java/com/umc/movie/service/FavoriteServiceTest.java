package com.umc.movie.service;

import com.umc.movie.entity.Favorite;
import com.umc.movie.entity.Member;
import com.umc.movie.exception.ApiException;
import com.umc.movie.repository.FavoriteRepository;
import com.umc.movie.repository.MemberRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class FavoriteServiceTest {
    @Mock FavoriteRepository favorites;
    @Mock MemberRepository members;
    @InjectMocks FavoriteService service;

    @Test
    void rejectsDuplicateFavoriteWithFavorite409_1BeforeSaving() {
        long memberId = 1L;
        long movieId = 550L;
        Member member = new Member("owner@example.com", "test-only", "밀러");
        when(members.findById(memberId)).thenReturn(Optional.of(member));
        lenient().when(favorites.existsByMember_MemberIdAndMovieId(memberId, movieId)).thenReturn(true);
        // Isolate the service check so the database UNIQUE constraint cannot provide the expected exception.
        lenient().when(favorites.saveAndFlush(any(Favorite.class))).thenAnswer(invocation -> invocation.getArgument(0));

        assertThatThrownBy(() -> service.create(memberId, movieId))
                .isInstanceOfSatisfying(ApiException.class, error -> {
                    assertThat(error.getStatus()).isEqualTo(HttpStatus.CONFLICT);
                    assertThat(error.getCode()).isEqualTo("FAVORITE409_1");
                });
    }
}
