package com.umc.study.book;

import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.umc.study.common.RequestValues;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
public class BookController {
    private final BookService bookService;

    @GetMapping("/category/{categoryId}")
    public List<Map<String, Object>> getBooksByCategory(@PathVariable long categoryId) {
        RequestValues.requirePositiveId(categoryId, "categoryId");
        return bookService.getBooksByCategory(categoryId);
    }
}
