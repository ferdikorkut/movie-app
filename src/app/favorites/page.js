"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getFavorites } from "@/lib/favorites";
import MovieGrid from "@/components/MovieGrid";

export default function FavoritesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/favorites");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    getFavorites(user.uid).then((data) => {
      setFavorites(
        data.map((f) => ({
          id: f.movieId,
          title: f.title,
          poster_path: f.posterPath,
          release_date: f.releaseDate,
          vote_average: f.voteAverage,
        }))
      );
      setFetching(false);
    });
  }, [user]);

  function handleFavoriteChange(movieId, isFavorite) {
    if (!isFavorite) {
      setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
    }
  }

  if (loading || !user || fetching) {
    return <p className="text-gray-400 p-6">Yükleniyor...</p>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-[28px] font-bold text-white">Favorilerim</h1>
        <span className="px-3 py-1 rounded-full bg-gray-800 text-gray-300 text-sm">
          {favorites.length} film
        </span>
      </div>
      {favorites.length === 0 ? (
        <p className="text-gray-400">Henüz favori filmin yok.</p>
      ) : (
        <MovieGrid movies={favorites} onFavoriteChange={handleFavoriteChange} />
      )}
    </main>
  );
}
