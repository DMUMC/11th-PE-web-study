import { useEffect, useState } from "react";

type RequestState<T> =
  | { status: "loading" }
  | { status: "error"; error: unknown }
  | { status: "success"; data: T };

// 요청 조건이 바뀌는 화면은 key로 새로 마운트해 이전 데이터를 표시하지 않아요.
export function useMovieRequest<T>(request: (signal: AbortSignal) => Promise<T>) {
  const [state, setState] = useState<RequestState<T>>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    request(controller.signal).then(
      (data) => {
        if (!controller.signal.aborted) setState({ status: "success", data });
      },
      (error: unknown) => {
        if (!controller.signal.aborted) setState({ status: "error", error });
      },
    );
    return () => controller.abort();
  }, [request]);

  return state;
}
