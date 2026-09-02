"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getPosterUrl } from "@/lib/tmdb";

export default function MovieDetailGuard({ movie }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/giris?redirect=/film/${movie.id}`);
    }
  }, [loading, user, movie.id, router]);

  if (loading || !user) {
    return <p className="text-gray-400 p-6">Yükleniyor...</p>;
  }

  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <main className="max-w-4xl mx-auto p-6 flex flex-col sm:flex-row gap-6">
      {posterUrl && (
        <img src={posterUrl} alt={movie.title} className="w-full sm:w-64 rounded-lg h-fit" />
      )}
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
        <p className="text-gray-400 mb-1">Yayın Tarihi: {movie.release_date}</p>
        <p className="text-gray-400 mb-1">Puan: {movie.vote_average}</p>
        <p className="text-gray-400 mb-4">
          Türler: {movie.genres?.map((g) => g.name).join(", ")}
        </p>
        <p className="text-gray-200 mb-6">{movie.overview}</p>
      </div>
    </main>
  );
}
