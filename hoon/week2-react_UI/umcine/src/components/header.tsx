export default function Header() {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1 className="logo">UMCine</h1>
        <nav className="nav-links">
          <a href="#" className="nav-item">홈</a>
          <a href="#" className="nav-item active">영화</a>
          <a href="#" className="nav-item">예매</a>
        </nav>
        <div className="user-actions">
          <button className="login-btn">로그인</button>
        </div>
      </div>
    </header>
  );
}
