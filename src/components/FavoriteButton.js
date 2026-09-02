"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { isFavorite, addFavorite, removeFavorite } from "@/lib/favorites";

export default function FavoriteButton({ movie, iconOnly = false, onChange }) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [favorite, setFavorite] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user) {
      setChecking(false);
      return;
    }
    setChecking(true);
    isFavorite(user.uid, movie.id).then((result) => {
      setFavorite(result);
      setChecking(false);
    });
  }, [user, movie.id]);

  async function handleClick() {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    if (favorite) {
      await removeFavorite(user.uid, movie.id);
      setFavorite(false);
      onChange?.(movie.id, false);
    } else {
      await addFavorite(user.uid, movie);
      setFavorite(true);
      onChange?.(movie.id, true);
    }
  }

  if (authLoading || checking) return null;

  if (iconOnly) {
    return (
      <button
        onClick={handleClick}
        aria-label={favorite ? "Favorilerden çıkar" : "Favorilere ekle"}
        title={favorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        className="p-1.5 rounded-full bg-black/25 hover:bg-black/40 backdrop-blur-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="20"
          height="20"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={
            favorite ? "text-red-500 fill-red-500" : "text-white fill-none"
          }
        >
          <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded-full font-medium text-white ${
        favorite ? "bg-gray-700 hover:bg-gray-600" : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {favorite ? "Favorilerden Çıkar" : "Favorilere Ekle"}
    </button>
  );
}
