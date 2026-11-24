import { useState } from "react";

const BASE = "http://localhost:8080";

const card = "border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-sm";
const input = "border border-gray-300 rounded px-2 py-1.5 mr-2 w-60";
const btn =
  "bg-indigo-600 text-white rounded px-3 py-1.5 hover:bg-indigo-700 transition";

export default function App() {
  const [result, setResult] = useState("여기에 결과가 표시됩니다.");
  const [nickname, setNickname] = useState("noco");
  const [email, setEmail] = useState("test@example.com");
  const [memberId, setMemberId] = useState("1");
  const [ratings, setRatings] = useState([]);

  const call = async (path) => {
    setRatings([]); // 다른 API 조회 시 평점 카드 숨기기
    try {
      const res = await fetch(BASE + path);
      const text = await res.text();

      let body = text;
      try {
        body = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        /* JSON이 아닌 응답은 그대로 사용 */
      }

      setResult(`GET ${path}\n상태: ${res.status}\n\n${body}`);
    } catch (e) {
      setResult(`GET ${path}\n요청 실패 (CORS 또는 서버 꺼짐): ${e}`);
    }
  };

  const loadRatings = async () => {
    const path = `/members/${memberId}/ratings`;
    try {
      const res = await fetch(BASE + path);
      const text = await res.text();

      let body = text;
      let data = [];
      try {
        const parsed = JSON.parse(text);
        body = JSON.stringify(parsed, null, 2);
        data = Array.isArray(parsed) ? parsed : [];
      } catch {
        /* JSON이 아니면 원문 그대로 */
      }

      setRatings(res.ok ? data : []);
      setResult(`GET ${path}\n상태: ${res.status}\n\n${body}`);
    } catch (e) {
      setRatings([]);
      setResult(`GET ${path}\n요청 실패 (CORS 또는 서버 꺼짐): ${e}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Movie API 테스트</h1>

        <section className={card}>
          <h3 className="font-semibold mb-2">
            1. 닉네임 중복 체크 (GET /members/nickname/&#123;nickname&#125;)
          </h3>
          <input
            className={input}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="nickname"
          />
          <button
            className={btn}
            onClick={() =>
              call(`/members/nickname/${encodeURIComponent(nickname)}`)
            }
          >
            중복 체크
          </button>
        </section>

        <section className={card}>
          <h3 className="font-semibold mb-2">
            2. 이메일 중복 체크 (GET /members/email/&#123;email&#125;)
          </h3>
          <input
            className={input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email"
          />
          <button
            className={btn}
            onClick={() => call(`/members/email/${encodeURIComponent(email)}`)}
          >
            중복 체크
          </button>
        </section>

        <section className={card}>
          <h3 className="font-semibold mb-2">
            3. 회원 평점 목록 (GET /members/&#123;memberId&#125;/ratings)
          </h3>
          <input
            className={input}
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
            placeholder="memberId"
          />
          <button className={btn} onClick={loadRatings}>
            조회
          </button>

          {ratings.length > 0 && (
            <div className="mt-4 grid gap-3">
              {ratings.map((r) => (
                <div
                  key={r.ratingId}
                  className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-500">
                      영화 ID: {r.movieId}
                    </span>
                    <span className="text-yellow-500 font-semibold">
                      {"★".repeat(r.score)}
                      {"☆".repeat(Math.max(0, 5 - r.score))} ({r.score}/5)
                    </span>
                  </div>
                  <p className="text-gray-800">{r.comment}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    작성: {r.createdAt.replace("T", " ")}
                    {r.updatedAt !== r.createdAt &&
                      ` · 수정: ${r.updatedAt.replace("T", " ")}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        <h3 className="font-semibold mb-2">응답 결과</h3>
        <pre className="bg-gray-900 text-green-300 rounded-lg p-4 whitespace-pre-wrap text-sm overflow-x-auto">
          {result}
        </pre>
      </div>
    </div>
  );
}