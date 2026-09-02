import { getPopularMovies } from "@/lib/tmdb";

export default async function HomePage() {
  const data = await getPopularMovies();
  return <pre>{JSON.stringify(data.results?.[0], null, 2)}</pre>;
}
