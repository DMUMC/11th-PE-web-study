export default function QueryError({ error, retry }: { error: Error; retry: () => void }) {
  return (
    <div className="my-3 text-sm">
      <p role="alert" className="text-red-700">{error.message}</p>
      <button type="button" onClick={retry} className="mt-2 rounded border bg-white px-3 py-2">다시 시도</button>
    </div>
  );
}
