import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

getMoviesWithFetch(1)
  .then((response) => {
    console.log("fetch 인기 영화 응답:", response);
    console.log("영화 배열:", response.results);
  })
  .catch((error: unknown) => {
    console.error("fetch 요청 실패:", error);
  });