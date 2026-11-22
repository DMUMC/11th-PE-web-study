export default function AccountPrompt({ error, retry }: { error: Error | null; retry: () => void }) {
  return (
    <main className="mx-auto w-full max-w-[600px] flex-1 px-5 py-16 text-center">
      <h1 role="status" className="text-2xl font-bold">
        {error ? '회원 정보를 불러오지 못했어요' : '회원 정보를 불러오고 있어요'}
      </h1>
      {error && <>
        <p role="alert" className="my-5">{error.message}</p>
        <button type="button" onClick={retry} className="min-h-11 rounded-lg border px-5">다시 시도</button>
      </>}
    </main>
  );
}
