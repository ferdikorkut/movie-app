# Movie App MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** TMDB API'sinden film verisi çeken, Firebase Auth ile e-posta/şifre girişi olan, giriş yapan kullanıcıların film detayına bakıp favorilere ekleyebildiği bir Next.js film keşif uygulaması kurmak.

**Architecture:** Next.js App Router; herkese açık film listeleme/arama TMDB'den Server Component'lerde sunucu tarafında çekilir; kimlik doğrulama ve favoriler istemci tarafında Firebase JS SDK (Auth + Firestore) ile yönetilir; oturum durumu bir React Context (`AuthContext`) ile tüm uygulamaya yayılır.

**Tech Stack:** Next.js (App Router, JavaScript), Tailwind CSS, Firebase (Auth + Firestore, modüler v9+ SDK), TMDB API v3.

**Spec:** `docs/superpowers/specs/2026-09-02-movie-app-design.md`

## Global Constraints

- Next.js App Router kullanılacak, TypeScript **değil**, sade JavaScript.
- Stil için Tailwind CSS.
- Kimlik doğrulama: Firebase Auth, sadece e-posta/şifre (Google girişi yok).
- Favoriler: Firestore, yol şeması `favorites/{userId}/movies/{movieId}`.
- TMDB API anahtarı (`TMDB_API_KEY`) `NEXT_PUBLIC_` öneki **almayacak** — sadece sunucu tarafında (Server Component) kullanılacak.
- Film detay sayfasında v1 kapsamında sadece temel bilgiler var (poster, başlık, özet, tarih, puan, tür) — oyuncu kadrosu ve fragman yok.
- Otomatik test yazılmayacak; her adım `npm run dev` ile tarayıcıda manuel doğrulanacak.

---

## Task 1: Next.js Projesinin Kurulumu

**Files:**
- Create: proje kökü (`create-next-app` ile otomatik oluşturulacak `app/`, `package.json`, `tailwind.config.js`, `next.config.js`, vb.)

**Interfaces:**
- Üretir: çalışan bir Next.js + Tailwind iskeleti, sonraki tüm task'lar bunun üzerine inşa edilecek.

- [ ] **Step 1: Next.js projesini mevcut klasörde oluştur**

Şu an klasörde sadece `.git` ve `docs/` var, bu yüzden `create-next-app` mevcut klasörde çalıştırılabilir:

```bash
npx create-next-app@latest . --js --tailwind --eslint --app --no-src-dir --import-alias "@/*" --no-turbopack
```

Sorulursa (mevcut dosyalar hakkında) devam etmesini onayla.

- [ ] **Step 2: Geliştirme sunucusunu başlat**

```bash
npm run dev
```

Beklenen: Terminalde `http://localhost:3000` adresi görünür.

- [ ] **Step 3: Tarayıcıda doğrula**

`http://localhost:3000` adresine git. Next.js'in varsayılan karşılama sayfasının Tailwind stilleriyle göründüğünü doğrula.

- [ ] **Step 4: Sunucuyu durdur ve commit at**

```bash
git add -A
git commit -m "Next.js + Tailwind proje iskeletini oluştur"
```

---

## Task 2: TMDB API Bağlantısı (`lib/tmdb.js`)

**Files:**
- Create: `.env.local`
- Modify: `.gitignore` (Next.js'in kendi oluşturduğu `.gitignore` zaten `.env*.local` satırını içerir — sadece doğrula)
- Create: `lib/tmdb.js`
- Modify: `app/page.js` (geçici olarak test amaçlı, Task 3'te asıl haline getirilecek)

**Interfaces:**
- Üretir: `getPopularMovies(page)`, `searchMovies(query, page)`, `getMovieDetails(id)`, `getPosterUrl(posterPath, size)` — Task 3, 4, 8 bu fonksiyonları kullanacak. Her biri TMDB'nin ham JSON cevabını (`{ results: [...] }` veya tek film objesi) döner.

- [ ] **Step 1: TMDB hesabı ve API anahtarı al**

https://www.themoviedb.org adresinde ücretsiz hesap oluştur, hesap ayarlarından "API" sekmesine gidip bir "API Key (v3 auth)" talep et. Bu adım tarayıcıda manuel yapılır, kod gerekmez.

- [ ] **Step 2: `.env.local` dosyasını oluştur**

Proje kökünde `.env.local`:

```
TMDB_API_KEY=buraya_kendi_anahtarini_yapistir
```

- [ ] **Step 3: `.gitignore` içinde `.env.local` olduğunu doğrula**

```bash
grep env.local .gitignore
```

Beklenen: `.env*.local` satırı görünür (create-next-app bunu otomatik ekler).

- [ ] **Step 4: `lib/tmdb.js` dosyasını oluştur**

```js
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export async function getPopularMovies(page = 1) {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=tr-TR&page=${page}`
  );
  if (!res.ok) {
    throw new Error("TMDB API isteği başarısız oldu");
  }
  return res.json();
}

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `${TMDB_BASE_URL}/search/movie?api_key=${process.env.TMDB_API_KEY}&language=tr-TR&query=${encodeURIComponent(
      query
    )}&page=${page}`
  );
  if (!res.ok) {
    throw new Error("TMDB arama isteği başarısız oldu");
  }
  return res.json();
}

export async function getMovieDetails(id) {
  const res = await fetch(
    `${TMDB_BASE_URL}/movie/${id}?api_key=${process.env.TMDB_API_KEY}&language=tr-TR`
  );
  if (!res.ok) {
    throw new Error("Film detayı alınamadı");
  }
  return res.json();
}

export function getPosterUrl(posterPath, size = "w500") {
  if (!posterPath) return null;
  return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}
```

- [ ] **Step 5: `app/page.js` içinde geçici olarak dene**

`app/page.js` içeriğini geçici olarak şuna çevir:

```jsx
import { getPopularMovies } from "@/lib/tmdb";

export default async function HomePage() {
  const data = await getPopularMovies();
  return <pre className="text-white">{JSON.stringify(data.results?.[0], null, 2)}</pre>;
}
```

- [ ] **Step 6: Tarayıcıda doğrula**

`npm run dev` çalışırken `http://localhost:3000` adresine git. Beklenen: ilk popüler filmin JSON verisi (başlık, özet vb.) ekranda görünür. Hata alırsan API anahtarını kontrol et.

- [ ] **Step 7: Commit at**

```bash
git add lib/tmdb.js .env.local app/page.js
git commit -m "TMDB API bağlantısını kur (lib/tmdb.js)"
```

(Not: `.env.local` `.gitignore` içinde olduğu için gerçekte commit'e girmez, `git add` komutu zararsızdır.)

---

## Task 3: Film Kartı ve Popüler Filmler Listesi

**Files:**
- Create: `components/MovieCard.js`
- Create: `components/MovieGrid.js`
- Modify: `app/page.js`

**Interfaces:**
- Tüketir: Task 2'den `getPopularMovies`, `getPosterUrl`.
- Üretir: `<MovieCard movie={movie} />` (bekler: `movie.id`, `movie.title`, `movie.poster_path`), `<MovieGrid movies={movies} />` — Task 4 ve Task 10 bu bileşenleri tekrar kullanacak.

- [ ] **Step 1: `components/MovieCard.js` oluştur**

```jsx
import Link from "next/link";
import { getPosterUrl } from "@/lib/tmdb";

export default function MovieCard({ movie }) {
  const posterUrl = getPosterUrl(movie.poster_path);

  return (
    <Link
      href={`/film/${movie.id}`}
      className="block rounded-lg overflow-hidden bg-gray-800 hover:scale-105 transition-transform"
    >
      {posterUrl ? (
        <img src={posterUrl} alt={movie.title} className="w-full h-auto" />
      ) : (
        <div className="w-full aspect-[2/3] bg-gray-700 flex items-center justify-center text-gray-400">
          Görsel yok
        </div>
      )}
      <div className="p-2">
        <h3 className="text-sm font-medium text-white truncate">{movie.title}</h3>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: `components/MovieGrid.js` oluştur**

```jsx
import MovieCard from "./MovieCard";

export default function MovieGrid({ movies }) {
  if (!movies || movies.length === 0) {
    return <p className="text-gray-400">Gösterilecek film bulunamadı.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: `app/page.js` dosyasını gerçek haline getir**

```jsx
import MovieGrid from "@/components/MovieGrid";
import { getPopularMovies } from "@/lib/tmdb";

export default async function HomePage() {
  const data = await getPopularMovies();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-6">Popüler Filmler</h1>
      <MovieGrid movies={data.results} />
    </main>
  );
}
```

- [ ] **Step 4: Tarayıcıda doğrula**

`http://localhost:3000` adresine git. Beklenen: popüler filmlerin poster ızgarası görünür, bir filme tıklayınca `/film/{id}` adresine gidilir (şu an 404 verecek, normal — Task 8'de o sayfayı yapacağız).

- [ ] **Step 5: Commit at**

```bash
git add components/MovieCard.js components/MovieGrid.js app/page.js
git commit -m "Popüler filmler ızgarasını ekle (MovieCard, MovieGrid)"
```

---

## Task 4: Film Arama

**Files:**
- Create: `components/SearchBar.js`
- Modify: `app/page.js`

**Interfaces:**
- Tüketir: Task 2'den `searchMovies`.
- Üretir: `<SearchBar defaultValue={query} />` — sadece bu sayfada kullanılır.

- [ ] **Step 1: `components/SearchBar.js` oluştur**

```jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Film ara..."
        className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Ara
      </button>
    </form>
  );
}
```

- [ ] **Step 2: `app/page.js` içinde arama sorgusunu işle**

```jsx
import MovieGrid from "@/components/MovieGrid";
import SearchBar from "@/components/SearchBar";
import { getPopularMovies, searchMovies } from "@/lib/tmdb";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const query = params?.q || "";
  const data = query ? await searchMovies(query) : await getPopularMovies();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">
          {query ? `"${query}" için arama sonuçları` : "Popüler Filmler"}
        </h1>
        <SearchBar defaultValue={query} />
      </div>
      <MovieGrid movies={data.results} />
    </main>
  );
}
```

- [ ] **Step 3: Tarayıcıda doğrula**

Ana sayfada arama kutusuna bir film adı yaz (örn. "matrix"), Ara butonuna bas. Beklenen: URL `?q=matrix` olur ve ilgili sonuçlar listelenir. Kutuyu boşaltıp tekrar aratınca popüler filmlere dönülür.

- [ ] **Step 4: Commit at**

```bash
git add components/SearchBar.js app/page.js
git commit -m "Film arama özelliğini ekle"
```

---

## Task 5: Firebase Projesi ve Kayıt Sayfası

**Files:**
- Create: `lib/firebase.js`
- Modify: `.env.local`
- Modify: `package.json` (firebase paketi eklenecek)
- Create: `app/kayit/page.js`

**Interfaces:**
- Üretir: `auth`, `db` (Task 6, 9, 10 bunları kullanacak).

- [ ] **Step 1: Firebase projesi oluştur**

https://console.firebase.google.com adresinde yeni proje oluştur. Proje içinde "Build > Authentication" bölümüne gidip "Email/Password" sağlayıcısını etkinleştir. Ardından "Project settings > General" içinde bir Web App ekleyip verilen config değerlerini not al. (Manuel adım, tarayıcıda yapılır.)

- [ ] **Step 2: Firebase paketini kur**

```bash
npm install firebase
```

- [ ] **Step 3: `.env.local` dosyasına Firebase değerlerini ekle**

```
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

- [ ] **Step 4: `lib/firebase.js` oluştur**

```js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
```

- [ ] **Step 5: `app/kayit/page.js` oluştur**

```jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function KayitPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      router.push("/");
    } catch (err) {
      setError("Kayıt başarısız: " + err.message);
    }
  }

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Kayıt Ol</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <input
          type="password"
          placeholder="Şifre (en az 6 karakter)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Kayıt Ol
        </button>
      </form>
    </main>
  );
}
```

- [ ] **Step 6: Tarayıcıda doğrula**

`http://localhost:3000/kayit` adresine git, bir hesap oluştur. Beklenen: kayıt sonrası ana sayfaya yönlendirilirsin. Firebase Console > Authentication > Users kısmında yeni kullanıcıyı gör.

- [ ] **Step 7: Commit at**

```bash
git add lib/firebase.js app/kayit/page.js package.json package-lock.json
git commit -m "Firebase kurulumu ve kayıt sayfasını ekle"
```

---

## Task 6: Giriş Sayfası ve AuthContext

**Files:**
- Create: `lib/auth-context.js`
- Create: `app/giris/page.js`
- Modify: `app/layout.js`

**Interfaces:**
- Tüketir: Task 5'ten `auth`.
- Üretir: `AuthProvider` (bileşen), `useAuth()` → `{ user, loading }` — Task 7, 8, 9, 10 bunu kullanacak.

- [ ] **Step 1: `lib/auth-context.js` oluştur**

```jsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

- [ ] **Step 2: `app/layout.js` içine `AuthProvider`'ı ekle**

```jsx
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";

export const metadata = {
  title: "MovieApp",
  description: "TMDB tabanlı film keşif uygulaması",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-gray-950 min-h-screen">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: `app/giris/page.js` oluştur**

```jsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function GirisPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push(redirectTo);
    } catch (err) {
      setError("Giriş başarısız: e-posta veya şifre hatalı");
    }
  }

  return (
    <main className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-4">Giriş Yap</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Giriş Yap
        </button>
      </form>
      <p className="text-gray-400 text-sm mt-3">
        Hesabın yok mu?{" "}
        <a href="/kayit" className="text-blue-400 underline">
          Kayıt Ol
        </a>
      </p>
    </main>
  );
}
```

- [ ] **Step 4: Tarayıcıda doğrula**

`http://localhost:3000/giris` adresine git, Task 5'te oluşturduğun hesapla giriş yap. Beklenen: ana sayfaya yönlendirilirsin. Yanlış şifreyle denediğinde hata mesajı görünür.

- [ ] **Step 5: Commit at**

```bash
git add lib/auth-context.js app/giris/page.js app/layout.js
git commit -m "AuthContext ve giriş sayfasını ekle"
```

---

## Task 7: Header (Üst Menü)

**Files:**
- Create: `components/Header.js`
- Modify: `app/layout.js`

**Interfaces:**
- Tüketir: Task 6'dan `useAuth()`.
- Üretir: her sayfada görünen sabit üst menü.

- [ ] **Step 1: `components/Header.js` oluştur**

```jsx
"use client";

import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-gray-900 border-b border-gray-700">
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
    </header>
  );
}
```

- [ ] **Step 2: `app/layout.js` içine `Header`'ı ekle**

```jsx
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";

export const metadata = {
  title: "MovieApp",
  description: "TMDB tabanlı film keşif uygulaması",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className="bg-gray-950 min-h-screen">
        <AuthProvider>
          <Header />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Tarayıcıda doğrula**

Ana sayfayı yenile. Beklenen: solda logo, ortada "Filmler"/"Favorilerim" linkleri, sağda giriş durumuna göre "Giriş Yap" veya ad-soyad + "Çıkış Yap" görünür. Giriş yap, çıkış yap, ikisini de dene.

- [ ] **Step 4: Commit at**

```bash
git add components/Header.js app/layout.js
git commit -m "Üst menüyü (Header) ekle"
```

---

## Task 8: Film Detay Sayfası (Giriş Kontrollü)

**Files:**
- Create: `components/MovieDetailGuard.js`
- Create: `app/film/[id]/page.js`

**Interfaces:**
- Tüketir: Task 2'den `getMovieDetails`, `getPosterUrl`; Task 6'dan `useAuth()`.
- Üretir: `/film/[id]` route'u; Task 9'da `FavoriteButton` bu sayfaya eklenecek.

- [ ] **Step 1: `components/MovieDetailGuard.js` oluştur**

```jsx
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
```

- [ ] **Step 2: `app/film/[id]/page.js` oluştur**

```jsx
import { getMovieDetails } from "@/lib/tmdb";
import MovieDetailGuard from "@/components/MovieDetailGuard";

export default async function FilmDetayPage({ params }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  return <MovieDetailGuard movie={movie} />;
}
```

- [ ] **Step 3: Tarayıcıda doğrula (çıkış yapmış halde)**

Çıkış yap. Ana sayfadan bir filme tıkla. Beklenen: `/giris?redirect=/film/{id}` adresine yönlendirilirsin. Giriş yaptıktan sonra otomatik olarak o filmin detayına dönersin ve poster, başlık, özet, tarih, puan, tür bilgilerini görürsün.

- [ ] **Step 4: Commit at**

```bash
git add components/MovieDetailGuard.js app/film
git commit -m "Film detay sayfasını ve giriş kontrolünü ekle"
```

---

## Task 9: Firestore Kurulumu ve Favorilere Ekle/Çıkar

**Files:**
- Create: `lib/favorites.js`
- Create: `components/FavoriteButton.js`
- Modify: `components/MovieDetailGuard.js`

**Interfaces:**
- Tüketir: Task 5'ten `db`, Task 6'dan `useAuth()`.
- Üretir: `isFavorite(userId, movieId)`, `addFavorite(userId, movie)`, `removeFavorite(userId, movieId)`, `getFavorites(userId)` — Task 10 `getFavorites`'i kullanacak.

- [ ] **Step 1: Firestore'u etkinleştir**

Firebase Console > Build > Firestore Database > "Create database" (production mode). Ardından "Rules" sekmesine şunu yapıştır ve yayınla:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /favorites/{userId}/movies/{movieId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Bu kural, bir kullanıcının sadece kendi `favorites/{kendi uid'si}` verisine erişebilmesini sağlar.

- [ ] **Step 2: `lib/favorites.js` oluştur**

```js
import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function isFavorite(userId, movieId) {
  const ref = doc(db, "favorites", userId, "movies", String(movieId));
  const snap = await getDoc(ref);
  return snap.exists();
}

export async function addFavorite(userId, movie) {
  const ref = doc(db, "favorites", userId, "movies", String(movie.id));
  await setDoc(ref, {
    movieId: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    addedAt: Date.now(),
  });
}

export async function removeFavorite(userId, movieId) {
  const ref = doc(db, "favorites", userId, "movies", String(movieId));
  await deleteDoc(ref);
}

export async function getFavorites(userId) {
  const ref = collection(db, "favorites", userId, "movies");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data());
}
```

- [ ] **Step 3: `components/FavoriteButton.js` oluştur**

```jsx
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
```

- [ ] **Step 4: `components/MovieDetailGuard.js` içine butonu ekle**

`</div>` kapanışından hemen önce (özet paragrafının altına) ekle:

```jsx
        <p className="text-gray-200 mb-6">{movie.overview}</p>
        <FavoriteButton movie={movie} />
      </div>
```

Dosyanın üstüne import ekle:

```jsx
import FavoriteButton from "@/components/FavoriteButton";
```

- [ ] **Step 5: Tarayıcıda doğrula**

Giriş yapmış halde bir film detayına git. "Favorilere Ekle" butonuna bas. Beklenen: buton "Favorilerden Çıkar" olur. Firebase Console > Firestore Database içinde `favorites/{senin uid'in}/movies/{filmId}` yolunda veriyi gör. Tekrar tıkla, favoriden çıktığını doğrula.

- [ ] **Step 6: Commit at**

```bash
git add lib/favorites.js components/FavoriteButton.js components/MovieDetailGuard.js
git commit -m "Firestore favoriler ve FavoriteButton ekle"
```

---

## Task 10: Favorilerim Sayfası

**Files:**
- Create: `app/favorilerim/page.js`

**Interfaces:**
- Tüketir: Task 6'dan `useAuth()`, Task 9'dan `getFavorites`, Task 3'ten `MovieGrid`.

- [ ] **Step 1: `app/favorilerim/page.js` oluştur**

```jsx
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
```

- [ ] **Step 2: Tarayıcıda doğrula**

Çıkış yapmış halde `/favorilerim` adresine git → `/giris?redirect=/favorilerim` adresine yönlendirilmelisin. Giriş yap → otomatik olarak favorilerim sayfasına dönmelisin ve az önce eklediğin filmi kart olarak görmelisin. Favorisi olmayan bir hesapla denediğinde "Henüz favori filmin yok" mesajını gör.

- [ ] **Step 3: Commit at**

```bash
git add app/favorilerim
git commit -m "Favorilerim sayfasını ekle"
```

---

## Bittiğinde

MVP'nin tamamı çalışır durumda: herkes popüler filmleri görüp arayabilir; giriş yapan kullanıcılar film detayına bakıp favorilerine ekleyip çıkarabilir ve favorilerini ayrı bir sayfada görebilir. `docs/GUNLUK.md` dosyasına bu planın tamamlandığını not düş.
