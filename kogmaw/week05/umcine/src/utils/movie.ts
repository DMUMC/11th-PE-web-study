export function getMovieTitle(movie: { title: string; original_title: string }) {
  return movie.title || movie.original_title || '제목 정보 없음';
}

export function formatReleaseDate(date: string) {
  return date ? date.replaceAll('-', '.') : '개봉일 미정';
}

export function formatRuntime(minutes: number | null) {
  if (!minutes || minutes < 0) return '상영 시간 정보 없음';
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return [hours && `${hours}시간`, remainder && `${remainder}분`].filter(Boolean).join(' ');
}

// TMDB list/search endpoints permit pages 1–500.
export function readPage(value: unknown): number | undefined {
  const page = Number(value);
  return Number.isInteger(page) && page > 1 ? Math.min(page, 500) : undefined;
}
