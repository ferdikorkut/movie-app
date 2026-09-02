"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getFavorites } from "@/lib/favorites";
import MovieGrid from "@/components/MovieGrid";

export default function FavorilerimPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/giris?redirect=/favorilerim");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!user) return;
    getFavorites(user.uid).then((data) => {
      setFavorites(
        data.map((f) => ({ id: f.movieId, title: f.title, poster_path: f.posterPath }))
      );
      setFetching(false);
    });
  }, [user]);

  if (loading || !user || fetching) {
    return <p className="text-gray-400 p-6">Yükleniyor...</p>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Favorilerim</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-400">Henüz favori filmin yok.</p>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </main>
  );
}
