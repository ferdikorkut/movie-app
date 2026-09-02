import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import { getPopularMovies, searchMovies } from "@/lib/tmdb";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || "";
  const data = query ? await searchMovies(query) : await getPopularMovies();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">
          {query ? `"${query}" için arama sonuçları` : "Popüler Filmler"}
        </h1>
        <SearchBar defaultValue={query} />
      </div>
      <MovieGrid movies={data.results} />
    </main>
  );
}
