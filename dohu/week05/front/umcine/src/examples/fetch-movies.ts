// Network 패널 확인용 예제다. 확인할 때만 main.tsx에서 임시로 import한다.
import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

getMoviesWithFetch(1)
  .then((response) => console.log(response.results))
  .catch((error) => console.error(error));
