import { QueryClient } from "@tanstack/react-query";
import { isHTTPError } from "ky";

const ONE_MINUTE = 60 * 1000;
const MAX_RETRY_COUNT = 2;

// 404 같은 4xx 응답은 다시 요청해도 결과가 같으므로 재시도하지 않는다.
function shouldRetry(failureCount: number, error: unknown) {
  if (isHTTPError(error) && error.response.status < 500) return false;
  return failureCount < MAX_RETRY_COUNT;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: ONE_MINUTE,
      retry: shouldRetry,
    },
  },
});
