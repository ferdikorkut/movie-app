"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { isFavorite, addFavorite, removeFavorite } from "@/lib/favorites";

export default function FavoriteButton({ movie }) {
  const { user } = useAuth();
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    isFavorite(user.uid, movie.id).then((result) => {
      setFavorite(result);
      setLoading(false);
    });
  }, [user, movie.id]);

  async function handleClick() {
    if (!user) return;
    if (favorite) {
      await removeFavorite(user.uid, movie.id);
      setFavorite(false);
    } else {
      await addFavorite(user.uid, movie);
      setFavorite(true);
    }
  }

  if (loading) return null;

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded font-medium text-white ${
        favorite ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
      }`}
    >
      {favorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
    </button>
  );
}
