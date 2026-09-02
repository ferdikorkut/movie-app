# Proje Günlüğü

Bu dosya, projede nerede kaldığımızı hatırlamak için tutulur. Her
önemli adımdan sonra buraya tarihli bir not eklenir.

## 2026-09-02 — Proje Başlangıcı

- Proje fikri belirlendi: TMDB API kullanan bir film keşif uygulaması.
  Herkes popüler filmleri görüp arama yapabilecek; film detayına
  girmek ve favorilere eklemek için giriş yapmak gerekecek.
- Brainstorming süreciyle şu kararlar alındı:
  - **Framework:** Next.js (App Router), JavaScript (TypeScript değil)
  - **Stil:** Tailwind CSS
  - **Kimlik doğrulama:** Firebase Auth, sadece e-posta/şifre (Google
    girişi v1'de yok)
  - **Favoriler:** Firebase Firestore, `favorites/{userId}/movies/{movieId}`
  - **Film detay sayfası:** v1'de sadece temel bilgiler (poster,
    başlık, özet, tarih, puan, tür) — cast/trailer yok
  - **Test yaklaşımı:** Otomatik test yok, tarayıcıda manuel doğrulama
- Tasarım belgesi onaylandı ve yazıldı:
  `docs/superpowers/specs/2026-09-02-movie-app-design.md`
- **Sıradaki adım:** Uygulama planı (implementation plan) oluşturmak,
  ardından Next.js projesinin kurulumu.
