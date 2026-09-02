"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

const navLinks = [
  { href: "/", label: "Filmler" },
  { href: "/favorites", label: "Favorilerim" },
];

export default function Header() {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-white">
            🎬 MovieApp
          </Link>
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname === link.href
                    ? "text-white font-semibold"
                    : "text-gray-300 hover:text-white"
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          {loading ? null : user ? (
            <div className="flex items-center gap-3">
              <span className="text-white">{user.displayName || user.email}</span>
              <button
                onClick={() => signOut(auth)}
                className="px-3 py-1 rounded-full bg-gray-700 text-white font-medium hover:bg-gray-600"
              >
                Çıkış Yap
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signup"
                className="px-4 py-2 rounded-full border border-gray-600 text-gray-300 font-medium hover:text-white hover:border-gray-400"
              >
                Kayıt Ol
              </Link>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700"
              >
                Giriş Yap
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
