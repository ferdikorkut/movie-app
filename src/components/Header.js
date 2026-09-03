"use client";

import { useEffect, useState } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const authSection = loading ? null : user ? (
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
  );

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold text-white">
            🎬 MovieApp
          </Link>
          <nav className="hidden sm:flex items-center gap-6">
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

        <div className="hidden sm:block">{authSection}</div>

        <button
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Menüyü kapat" : "Menüyü aç"}
          className="sm:hidden text-gray-300 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="26"
            height="26"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-gray-700 px-6 py-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-3">
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
          {authSection}
        </div>
      )}
    </header>
  );
}
