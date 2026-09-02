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

## 2026-09-02 — Tasarım Onaylandı

- Kullanıcı tasarım belgesini onayladı.
- **Sıradaki adım:** Uygulama planı (implementation plan) oluşturuluyor.

## 2026-09-02 — Uygulama Planı Hazır

- 10 task'lık detaylı uygulama planı yazıldı:
  `docs/superpowers/plans/2026-09-02-movie-app-mvp.md`
  1. Next.js + Tailwind kurulumu
  2. TMDB API bağlantısı (lib/tmdb.js)
  3. Film kartı + popüler filmler ızgarası
  4. Film arama
  5. Firebase projesi + kayıt sayfası
  6. Giriş sayfası + AuthContext
  7. Header (üst menü)
  8. Film detay sayfası (giriş kontrollü)
  9. Firestore kurulumu + favorilere ekle/çıkar
  10. Favorilerim sayfası
- **Sıradaki adım:** Task 1'den başlayarak, birlikte adım adım uygulamaya
  geçmek. Her task bittiğinde bu dosyaya not düşülecek.

## 2026-09-02 — Task 1 Tamamlandı: Next.js Kurulumu

- `create-next-app` ile proje kuruldu (JavaScript, Tailwind, ESLint, App
  Router, src/ klasörü olmadan — tasarım belgesiyle tutarlı).
- `npx` ile `npm`/`npm install` arasındaki fark, `create-next-app`'in
  arka planda `react`/`next`'i kalıcı kurduğu ama kendisinin kalıcı
  kurulmadığı konuşuldu.
- src/ klasörü kullanılmaması bilinçli bir tercih: tasarım belgesindeki
  klasör yapısıyla tutarlı olsun ve öğrenme aşamasında bir katman daha
  az karmaşıklık olsun diye.
- Geliştirme sunucusu (`npm run dev`) çalıştığı doğrulandı.
- **Sıradaki adım:** Task 2 — TMDB API bağlantısı (`lib/tmdb.js`).

## 2026-09-02 — Kullanıcı Kararı: src/ Klasörüne Geçildi

- İlk kararın aksine, `app/` klasörü `src/app/` altına taşındı (kullanıcı
  daha temiz bir kök dizin istedi).
- `jsconfig.json` içindeki `@/*` import kısayolu `./src/*`'a güncellendi
  — yani kod içindeki `@/lib/...`, `@/components/...` importları hiç
  değişmedi, sadece dosyaların fiziksel konumu değişti.
- Tasarım belgesi ve uygulama planındaki tüm dosya yolları (`Create:`,
  `Modify:`, `git add` komutları) `src/` önekiyle güncellendi.
- **Sıradaki adım:** Task 2 — TMDB API bağlantısı (`src/lib/tmdb.js`).
