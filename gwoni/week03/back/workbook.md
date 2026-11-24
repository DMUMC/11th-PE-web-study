## 3. [실습 1] 도서 전체 목록 조회 API (GET /books)

2주차에는 MySQL Workbench를 켜고 쿼리창에 **SELECT * FROM book;**을 적은 뒤 실행 버튼을 손수 눌렀습니다.

이제 이 과정을 Postman이 요청을 보내면 백엔드 서버가 DB에서 데이터를 꺼내와 응답해 주는 **완제품 API**로 만들어봅시다!

!getbook.drawio.png

### 1단계 : Repository (창고지기에게 SELECT 쿼리 시키기)

가장 밑단인 데이터베이스 접근 계층부터 만듭니다.

#### 🍃 Spring Boot (BookRepository.java)

**src/main/java/.../repository** 패키지 안에 **BookRepository.java**를 생성합니다.

```java
// src/main/java/.../repository/BookRepository.java
package com.umc.study.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository // 스프링 컨테이너에 "나 창고지기 부품이야!"라고 등록
@RequiredArgsConstructor
public class BookRepository {

    // 2단계에서 준비된 스프링의 DB 통신 도구(JdbcTemplate) 주입
    private final JdbcTemplate jdbcTemplate;

    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM book";
        
        // 쿼리를 실행하고 결과를 List<Map> 형태의 날것 데이터로 긁어옵니다.
        // Map의 Key는 '컬럼명(title)', Value는 '실제 데이터(달빛 도서관)'가 됩니다.
        return jdbcTemplate.queryForList(sql);
    }
}
```

!image.png

### 2단계 : Service (셰프) & Controller (웨이터) 연결하기

창고지기(Repository)가 준비되었으니, 주방(Service)과 카운터(Controller)를 연결해 주문을 받을 수 있게 만듭니다.

> **🤔 “어? 지금은 Service 코드가 그냥 Repository 호출만 하고 끝인데, 굳이 필요할까요?”**
> 
> 
> 지금 실습이 단순해서 그렇게 보이지만, 나중에 비즈니스 규칙이 들어가는 곳이 **Service** 계층입니다!
> 

#### 🍃 Spring Boot (BookService.java)

**src/main/java/.../service** 패키지 안에 **BookService.java**를 생성합니다.

```java
// src/main/java/.../service/BookService.java
package com.umc.study.service;

import com.umc.study.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service // 비즈니스 로직을 수행하는 메인 셰프 계층
@RequiredArgsConstructor
public class BookService {

    // 창고지기(Repository)를 생성자 주입으로 데려옵니다.
    private final BookRepository bookRepository;

    public List<Map<String, Object>> getAllBooks() {
        // 지금은 별도 가공 없이 창고지기가 가져온 도서 목록을 그대로 반환합니다.
        return bookRepository.findAll();
    }
}
```

!image.png

### 3단계 : Controller (카운터 직원) 작성 & 라우팅 연결

손님(Postman/브라우저)이 보낸 HTTP 요청을 받아 주방장에게 넘기고, 최종 결과를 손님 테이블로 서빙(응답)하는 카운터를 만듭니다.

#### 🍃 Spring Boot (BookController.java)

**src/main/java/.../controller** 패키지 안에 **BookController.java**를 생성합니다.

```java
// src/main/java/.../controller/BookController.java
package com.umc.study.controller;

import com.umc.study.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController // 1. "나는 데이터를 JSON으로 서빙하는 API 카운터야!"
@RequestMapping("/books") // 2. 이 컨트롤러로 들어오는 요청의 기본 주소는 /books
@RequiredArgsConstructor
public class BookController {

    // 주방장(Service)을 주입받아 카운터 옆에 대기시킵니다.
    private final BookService bookService;

    // 3. HTTP GET 방식으로 /books 요청이 들어왔을 때 이 메서드가 실행됩니다.
    @GetMapping
    public List<Map<String, Object>> getBooks() {
        return bookService.getAllBooks();
    }
}
```

!image.png

### 4단계 : **Postman으로 직접 찔러보고 관찰하기!**

완성된 코드가 실제로 MySQL까지 다녀오는지 확인해 봅시다.

1. **서버 구동하기**:
    - **Spring**: IntelliJ 상단의 초록색 **Run** 버튼 클릭
    - **NestJS**: 터미널에서 **npm run start:dev** 입력
2. **Postman 세팅**:
    - Method: **GET**
    - URL: **http://localhost:8080/books** (Spring) 또는 **http://localhost:3000/books** (NestJS)
3. 파란색 **[Send]** 버튼을 힘차게 눌러봅니다!

!Spring

Spring

!Node.js

Node.js

## 4. [실습 2] 신규 도서 등록 API (POST /books) & 보안의 기초

이번에는 클라이언트(Postman)가 보낸 책 정보를 받아 DB에 **INSERT**하는 **POST API**를 만들어봅시다.

**잠깐! 백엔드 개발자라면 꼭 알아야 할 보안 상식 : SQL Injection**

만약 쿼리를 이렇게 문자열 더하기 방식으로 조립하면 어떻게 될까요?

**"INSERT INTO book (title) VALUES ('" + title + "')"**

만약 악의적인 사용자가 책 제목 입력창에 **' ); DROP TABLE book; --** 같은 무시무시한 값을 적어 보낸다면, DB는 테이블 전체를 날려버리는 대참사가 일어납니다.

이를 방지하기 위해 값 자리에 물음표를 뚫어두고, 드라이버가 값을 안전하게 텍스트로 치환하게 만드는 **파라미터 바인딩**을 반드시 써야 합니다!

### 1단계 : Repository (INSERT 쿼리와 파라미터 바인딩)

#### 🍃 Spring Boot (BookRepository.java에 메서드 추가)

jdbcTemplate.update() 메서드는 INSERT, UPDATE, DELETE처럼 데이터를 변경하는 쿼리를 실행할 때 사용합니다.

```java
public void save(Map<String, Object> body){
    // book_id는 AUTO_INCREMENT이므로 생략, is_available은 기본 true로 삽입
    String sql = "INSERT INTO book (category_id, title, description, is_available) VALUES (?, ?, ?, true)";

    // SQL 뒤에 파라미터를 차례대로 넘겨주면 ? 자리에 순서대로 안전하게 바인딩됩니다.
    jdbcTemplate.update(
            sql,
            body.get("categoryId"),
            body.get("title"),
            body.get("description")
    );
}
```

!image.png

### 2단계 : Service & Controller 연결하기 (POST 라우팅)

#### 🍃 Spring Boot

클라이언트가 JSON Body로 보낸 데이터를 **@RequestBody**를 통해 자바 **Map** 형태로 바로 전달받습니다.

```java
// BookService.java에 추가
public void createBook(Map<String, Object> body){
    bookRepository.save(body);
}
```

!image.png

```java
// BookController.java에 추가
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// POST http://localhost:8080/books
@PostMapping
public String createBook(@RequestBody Map<String, Object> body){
    bookService.createBook(body);
    return "도서 등록이 완료되었습니다!";
}
```

!image.png

### 3단계 : Postman으로 POST 등록 테스트 & GET 재검증!

0주차 실습 3에서 배웠던 것처럼 **POST 요청 + JSON Body**를 세팅해서 날려봅시다.

**Postman 세팅**:

1. Method: **POST**
2. URL: **http://localhost:8080/books** (Spring) / **http://localhost:3000/books** (NestJS)
3. **[Body]** → 우측 끝 드롭다운에서 [JSON]을 선택합니다.
4. 아래 JSON을 본문에 붙여넣습니다:

```json
{
  "categoryId": 1,
  "title": "클린 코드",
  "description": "애자일 소프트웨어 장인 정신"
}
```

1. 파란색 **[Send]** 버튼을 클릭합니다!

- **응답 본문**: **"도서 등록이 완료되었습니다!"** 문구가 화면에 뜨는지 확인합니다.

!Spring

Spring

!Node.js

Node.js

- **DB 검증**: 아까 열어둔 GET /books 탭으로 돌아가서 다시 [Send]를 눌러보세요. 목록 맨 끝에 방금 등록한 **"클린 코드"**가 새롭게 추가되어 있는 것을 볼 수 있습니다!

!Spring

Spring

!Node.js

Node.js
