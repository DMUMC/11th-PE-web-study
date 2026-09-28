import type { CSSProperties } from "react";

const arrowStyle: CSSProperties = {
  width: 40,
  height: 40,
  color: "#d5e3ff",
  backgroundColor: "transparent",
  border: "none",
};

export default function Pagination() {
  return (
    <nav
      className="pagination main-container"
      aria-label="영화 목록 페이지"
      style={{ marginTop: 0, paddingTop: 16, paddingBottom: 64 }}
    >
      <button className="pagination-button" type="button" aria-label="이전 페이지" style={arrowStyle} disabled>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m12 5-5 5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        className="pagination-button active"
        type="button"
        aria-current="page"
        aria-label="1페이지"
        style={{ width: 40, height: 40, backgroundColor: "#1d1e20", border: "none", borderRadius: 8, fontWeight: 600 }}
      >
        1
      </button>
      <button className="pagination-button" type="button" aria-label="다음 페이지" style={arrowStyle} disabled>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="m8 5 5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </nav>
  );
}
