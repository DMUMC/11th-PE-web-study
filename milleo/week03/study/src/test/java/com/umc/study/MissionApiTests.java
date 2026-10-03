package com.umc.study;

import com.umc.study.book.BookRepository;
import com.umc.study.rental.RentalRepository;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.web.servlet.MockMvc;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class MissionApiTests {
    @Autowired MockMvc mvc;
    @MockitoBean BookRepository books;
    @MockitoBean RentalRepository rentals;
    @MockitoBean PlatformTransactionManager transactions;

    @Test void categoryIsPassedToRepository() throws Exception {
        when(books.findByCategoryId(2)).thenReturn(List.of(Map.of("book_id", 3, "category_id", 2)));
        mvc.perform(get("/books/category/2")).andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category_id").value(2));
        verify(books).findByCategoryId(2);
    }

    @Test void emptyCategoryReturnsAnArray() throws Exception {
        when(books.findByCategoryId(999)).thenReturn(List.of());
        mvc.perform(get("/books/category/999")).andExpect(status().isOk())
                .andExpect(content().json("[]"));
    }

    @Test void invalidCategoryDoesNotReachDatabase() throws Exception {
        mvc.perform(get("/books/category/0")).andExpect(status().isBadRequest());
        mvc.perform(get("/books/category/abc")).andExpect(status().isBadRequest());
        verifyNoInteractions(books);
    }

    @Test void rentalReturnsCreatedWithStoredRecord() throws Exception {
        when(rentals.create(1, 3)).thenReturn(Map.of("rental_id", 4, "user_id", 1, "book_id", 3));
        mvc.perform(post("/rentals").contentType("application/json")
                        .content("{\"userId\":1,\"bookId\":3}"))
                .andExpect(status().isCreated()).andExpect(jsonPath("$.rental_id").value(4));
        verify(rentals).create(1, 3);
    }

    @Test void malformedRentalBodyDoesNotReachDatabase() throws Exception {
        for (String body : List.of("{\"userID\":1,\"bookId\":3}",
                "{\"userId\":1.5,\"bookId\":3}", "{\"userId\":-1,\"bookId\":3}",
                "{\"userId\":\"1\",\"bookId\":3}")) {
            mvc.perform(post("/rentals").contentType("application/json").content(body))
                    .andExpect(status().isBadRequest());
        }
        verifyNoInteractions(rentals);
    }

    @Test void missingForeignKeyReturnsReadableError() throws Exception {
        when(rentals.create(1, 999)).thenThrow(new DataIntegrityViolationException("foreign key"));
        mvc.perform(post("/rentals").contentType("application/json")
                        .content("{\"userId\":1,\"bookId\":999}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("userId와 bookId가 DB에 존재하는지 확인해주세요."));
    }
}
