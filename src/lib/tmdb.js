const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function getPopularMovies(page = 1) {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=tr-TR&page=${page}`
  );
  if (!res.ok) {
    throw new Error("TMDB API isteği başarısız oldu");
  }
  return res.json();
}

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&language=tr-TR&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  if (!res.ok) {
    throw new Error("TMDB arama isteği başarısız oldu");
  }
  return res.json();
}

export async function getMovieDetails(id) {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=tr-TR`
  );
  if (!res.ok) {
    throw new Error("Film detayı alınamadı");
  }
  return res.json();
}

export function getPosterUrl(posterPath, size = "w500") {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}
