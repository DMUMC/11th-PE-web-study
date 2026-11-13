export default function RequestFeedback({ message, retry }: { message?: string; retry?: () => void }) {
  return <section className="my-8 rounded-xl border border-gray-200 bg-white px-6 py-16 text-center" role={message ? 'alert' : 'status'}>
    {!message && <div aria-hidden="true" className="mx-auto mb-4 size-8 rounded-full border-4 border-gray-200 border-t-orange-500 motion-safe:animate-spin" />}
    <h2 className="text-lg font-bold">{message ? '영화를 불러오지 못했어요' : '영화를 불러오는 중입니다'}</h2>
    <p className="mt-3 text-sm text-gray-600">{message ?? '잠시만 기다려 주세요.'}</p>
    {retry && <button type="button" onClick={retry} className="mt-6 min-h-11 rounded-md bg-[#17191d] px-6 py-3 text-sm font-bold text-white">다시 시도</button>}
  </section>;
}
