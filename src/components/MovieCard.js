import Link from "next/link";
import { getPosterUrl } from "@/lib/tmdb";

export default function MovieCard({ movie }) {
  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <Link
      href={`/film/${movie.id}`}
      className="block rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition-transform"
    >
      {posterUrl ? (
        <img src={posterUrl} alt={movie.title} className="w-full h-auto" />
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center text-gray-400">
          Görsel yok
        </div>
      )}
      <div className="p-2">
        <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
      </div>
    </Link>
  );
}
