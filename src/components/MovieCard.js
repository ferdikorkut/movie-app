import Link from "next/link";
import { getPosterUrl } from "@/lib/tmdb";
import FavoriteButton from "@/components/FavoriteButton";

export default function MovieCard({ movie, onFavoriteChange }) {
  const posterUrl = getPosterUrl(movie.poster_path);
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition-transform">
      <Link href={`/film/${movie.id}`} className="block">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full aspect-[2/3] object-cover"
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center text-gray-400">
            Görsel yok
          </div>
        )}
        <div className="p-2">
          <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
          {(year || rating) && (
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs text-gray-400">{year}</span>
              {rating && (
                <span className="text-xs text-yellow-400 font-medium">⭐ {rating}</span>
              )}
            </div>
          )}
        </div>
      </Link>
      <div className="absolute top-2 right-2">
        <FavoriteButton movie={movie} iconOnly onChange={onFavoriteChange} />
      </div>
    </div>
  );
}
