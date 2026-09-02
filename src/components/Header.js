"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-white">
            🎬 MovieApp
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white">
              Filmler
            </Link>
            <Link href="/favorilerim" className="text-gray-300 hover:text-white">
              Favorilerim
            </Link>
          </nav>
        </div>
        <div>
          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              <span className="text-white">{user.displayName || user.email}</span>
              <button
                onClick={() => signOut(auth)}
                className="px-3 py-1 rounded bg-gray-700 text-white hover:bg-gray-600"
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            <Link
              href="/giris"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Giriş Yap
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
