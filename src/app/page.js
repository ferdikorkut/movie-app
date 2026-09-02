import MovieGrid from "@/components/MovieGrid";
import { getPopularMovies } from "@/lib/tmdb";

export default async function HomePage() {
  const data = await getPopularMovies();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Popüler Filmler</h1>
      <MovieGrid movies={data.results} />
    </main>
  );
}
