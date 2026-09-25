export default function Pagination() {
  // 필수 미션에서는 페이지 번호의 화면 구조만 구현한다.
  return (
    <nav className="pagination" aria-label="영화 목록 페이지">
      <button type="button" aria-label="이전 페이지" disabled>
        <img src="/icons/chevron-left.svg" alt="" />
      </button>
      {[1, 2, 3, 4, 5].map((page) => (
        <button
          key={page}
          type="button"
          aria-label={`${page}페이지`}
          aria-current={page === 1 ? 'page' : undefined}
          disabled={page !== 1}
        >
          {page}
        </button>
      ))}
      <button type="button" aria-label="다음 페이지" disabled>
        <img src="/icons/chevron-right.svg" alt="" />
      </button>
    </nav>
  );
}
