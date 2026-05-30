import { useLocation } from "react-router-dom";

export default function MainPage() {
  const location = useLocation();

  const userId = location.state?.userId || "Guest";

  return (
    <div>
      <header
        style={{
          background: "#334155",
          color: "white",
          padding: "15px",
          fontSize: "20px",
        }}
      >
        {userId}님 환영합니다.
      </header>

      <div style={{ padding: "20px" }}>
        <h2>메인 페이지</h2>
        <p>로그인 성공!</p>
      </div>
    </div>
  );
}