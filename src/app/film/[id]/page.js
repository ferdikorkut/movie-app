import { getMovieDetails } from "@/lib/tmdb";
import MovieDetailGuard from "@/components/MovieDetailGuard";

export default async function FilmDetayPage({ params }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  return <MovieDetailGuard movie={movie} />;
}
