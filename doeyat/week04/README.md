# Week 04

week03 프로젝트를 이어서 프론트엔드의 북마크 상태 관리와 백엔드의 JPA 도서 API를 구현했습니다.

## 프론트엔드 (`umcine`)

- Zustand로 영화 북마크 상태를 관리하고, persist와 localStorage로 새로고침 후에도 유지합니다.
- 목록, 검색 결과, 상세 화면에서 공통 `BookmarkButton`을 사용합니다.
- 북마크 버튼과 상세 페이지 링크를 분리해 북마크 클릭 시 페이지가 이동하지 않도록 했습니다.

실행 환경: Node.js 22.12 이상, pnpm.

```sh
cd doeyat/week04/umcine
pnpm install --frozen-lockfile
pnpm dev
```

검증: `pnpm lint`, `pnpm build`.
브라우저에서 같은 영화를 목록·검색·상세 화면에서 북마크한 뒤 새로고침해 상태가 유지되는지 확인합니다.

## 백엔드 (`study`)

- Book, Category 엔티티와 Spring Data JPA Repository를 사용합니다.
- `GET /books`: 도서 ID 내림차순으로 목록과 카테고리명을 반환합니다.
- `POST /books`: 카테고리 ID, 제목, 설명으로 도서를 등록하고 201을 반환합니다.
- 제목 누락·공백·100자 초과 및 존재하지 않는 카테고리는 400 응답으로 처리합니다.

실행 환경: JDK 21, MySQL. `DB_URL`, `DB_USER`, `DB_PW` 환경 변수를 설정하고 `gradlew.bat bootRun`으로 실행합니다.
`ddl-auto: validate`를 사용하므로 기존 실습 DB의 `book`, `category`, `rental` 테이블과 등록할 카테고리가 필요합니다. 운영 설정은 테이블을 자동 생성하지 않습니다.

요청 예시:

```json
{
  "categoryId": 1,
  "title": "테스트 도서",
  "description": "도서 소개"
}
```

검증: `cd doeyat/week04/study` 후 `gradlew.bat test`.
테스트는 H2의 MySQL 호환 모드를 사용해 외부 DB 없이 실행합니다. 실제 MySQL 스키마와의 호환성은 실행 환경에서 별도로 확인해야 합니다.

## 제출 범위

- 브랜치: `week04_doeyat`
- PR 제목: `[week04] doeyat 4주차 미션`
- 커밋 대상: `doeyat/week04/`만 포함합니다. `doeyat/week05/`는 별도 주차 작업입니다.
- Gradle Wrapper JAR도 포함되도록 `study/.gitignore`에 예외를 추가했습니다.

PR 내용 초안:

> Zustand의 전역 상태와 persist를 사용해 화면 간 북마크 상태를 공유하고 새로고침 후에도 유지하도록 구현했습니다. 도서 API는 JDBC 기반 도서 조회·등록을 JPA와 DTO로 변경하고 요청 검증 및 예외 응답을 추가했습니다. 상태 관리와 영속화의 역할, 엔티티와 응답 DTO를 나누는 이유를 실습했습니다.
