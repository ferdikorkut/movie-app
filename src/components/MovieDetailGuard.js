"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { getPosterUrl, getBackdropUrl } from "@/lib/tmdb";
import FavoriteButton from "@/components/FavoriteButton";

function formatDate(dateStr) {
  if (!dateStr) return dateStr;
  const [year, month, day] = dateStr.split("-");
  return `${day}.${month}.${year}`;
}

function formatRuntime(minutes) {
  if (!minutes) return null;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours} sa ${mins} dk` : `${mins} dk`;
}

export default function MovieDetailGuard({ movie }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?redirect=/film/${movie.id}`);
    }
  }, [loading, user, movie.id, router]);

  if (loading || !user) {
    return <p className="text-gray-400 p-6">Yükleniyor...</p>;
  }

  const posterUrl = getPosterUrl(movie.poster_path);
  const backdropUrl = getBackdropUrl(movie.backdrop_path);
  const runtimeLabel = formatRuntime(movie.runtime);
  const countries = movie.production_countries?.map((c) => c.name).join(", ");
  const languages = movie.spoken_languages
    ?.map((l) => l.english_name || l.name)
    .join(", ");

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[28px] font-bold text-white hover:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Filmlere Dön
        </Link>
      </div>

      {backdropUrl && (
        <img
          src={backdropUrl}
          alt=""
          className="w-full h-64 sm:h-80 object-cover rounded-lg mb-6"
        />
      )}

      <div className="flex flex-col sm:flex-row gap-6">
        {posterUrl && (
          <div className="relative w-full sm:w-64 h-fit">
            <img src={posterUrl} alt={movie.title} className="w-full rounded-lg" />
            <div className="absolute top-2 right-2">
              <FavoriteButton movie={movie} iconOnly />
            </div>
          </div>
        )}
        <div className="flex-1 text-left">
          <h1 className="text-3xl font-bold text-white mb-1">{movie.title}</h1>
          {movie.tagline && <p className="text-gray-400 italic mb-3">{movie.tagline}</p>}

          <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mb-3">
            <span className="text-yellow-400 font-medium">
              ⭐ {movie.vote_average}
              {movie.vote_count ? ` (${movie.vote_count} oy)` : ""}
            </span>
            <span className="text-gray-400">{formatDate(movie.release_date)}</span>
            {runtimeLabel && <span className="text-gray-400">{runtimeLabel}</span>}
          </div>

          {movie.genres?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-xs"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {countries && (
            <p className="text-gray-400 mb-1">Yapım Ülkesi: {countries}</p>
          )}
          {languages && <p className="text-gray-400 mb-4">Dil: {languages}</p>}
          <p className="text-gray-200 mb-6">{movie.overview}</p>
        </div>
      </div>
    </main>
  );
}
