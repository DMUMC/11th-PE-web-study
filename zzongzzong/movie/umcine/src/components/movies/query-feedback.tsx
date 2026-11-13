interface QueryFeedbackProps {
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function QueryFeedback({ isFetching, isError, onRetry }: QueryFeedbackProps) {
  if (isFetching) return <p role="status" className="mb-4">최신 정보를 확인하고 있어요.</p>;
  if (isError) return (
    <div role="alert" className="mb-4">
      <p>최신 정보를 가져오지 못해 이전 결과를 표시하고 있어요.</p>
      <button type="button" onClick={onRetry} className="underline cursor-pointer">다시 시도</button>
    </div>
  );
  return null;
}

export function QueryError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert">
      <p>{message}</p>
      <button type="button" onClick={onRetry} className="mt-3 px-4 py-2 rounded-lg bg-[#17191E] text-white cursor-pointer">다시 시도</button>
    </div>
  );
}
