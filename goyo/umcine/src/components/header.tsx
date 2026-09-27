
export default function Header() {
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        height: "64px",
        padding: "0 48px",
        boxSizing: "border-box",
        background: "#FFFFFF",
        fontFamily: "Pretendard, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "32px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "6px",
          }}
        >
          <img
            src="/movie-icons/movie.svg"
            alt="UMCine 로고"
            style={{
              width: "24px",
              height: "24px",
              display: "block",
              border: "2px solid #000000",
              borderRadius: "8px",
              padding:"2px"
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              color: "#17191E",
              whiteSpace: "nowrap",
            }}
          >
            UMCine
          </span>
        </div>

        <nav
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "24px",
          }}
        >
          {["영화", "인물", "내 정보"].map((menu) => (
            <a
              key={menu}
              href="#"
              style={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#17191E",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              {menu}
            </a>
          ))}
        </nav>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <button
          type="button"
          aria-label="검색"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "36px",
            height: "36px",
            padding: 0,
            background: "transparent",
            border: "1px solid #E3E6EB",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          <img
            src="/movie-icons/search.svg"
            alt=""
            style={{
              width: "18px",
              height: "18px",
              display: "block",
              background: "transparent",
              border: "none",
            }}
          />
        </button>

        <button
          type="button"
          style={{
            height: "36px",
            padding: "0 16px",
            background: "#2563EB",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "8px",
            fontFamily: "Pretendard, sans-serif",
            fontSize: "14px",
            fontWeight: 700,
            whiteSpace: "nowrap",
            cursor: "pointer",
          }}
        >
          로그인
        </button>
      </div>
    </header>
  );
}
