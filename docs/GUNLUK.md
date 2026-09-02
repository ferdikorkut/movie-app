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

## 2026-09-02 — GitHub'a İlk Push

- `origin` (https://github.com/ferdikorkut/movie-app.git) zaten tanımlıydı
  ama upstream bağlantısı kopmuştu ("upstream is gone").
- `git push -u origin main` ile ilk push yapıldı, `main` branch'i artık
  `origin/main`'i takip ediyor.
- VSCode'daki Commit/Push/Sync farkı ve merge conflict (çakışma) çözümü
  konuşuldu (bkz. sohbet geçmişi).

## 2026-09-02 — Task 2 Tamamlandı: TMDB API Bağlantısı

- Kullanıcı themoviedb.org'dan API anahtarı aldı, `.env.local`'a eklendi
  (git'e gitmediği doğrulandı: `git check-ignore -v .env.local`).
- `src/lib/tmdb.js` oluşturuldu: `getPopularMovies`, `searchMovies`,
  `getMovieDetails`, `getPosterUrl`.
- Küçük bir hata yakalandı ve düzeltildi: geçici test sayfasında
  `text-white` sınıfı açık modda beyaz zemin üzerinde beyaz yazıya
  (görünmez metin) sebep oluyordu — kaldırıldı.
- **Sıradaki adım:** Task 3 — Film kartı ve popüler filmler ızgarası
  (`src/components/MovieCard.js`, `src/components/MovieGrid.js`).

## 2026-09-02 — Task 3 Tamamlandı: Popüler Filmler Izgarası

- `src/components/MovieCard.js` ve `src/components/MovieGrid.js`
  oluşturuldu, `src/app/page.js` gerçek haline getirildi.
- İki hata bulundu ve düzeltildi:
  1. **Koyu tema görünmüyordu:** `globals.css`'te create-next-app'in
     bıraktığı katmansız (`@layer` dışı) `body { background: ...; }`
     kuralı, Tailwind'in katmanlı `bg-gray-950`/`text-white` utility
     class'larını CSS cascade layers kuralı gereği eziyordu (katmansız
     kurallar her zaman katmanlı kurallardan kazanır, specificity'den
     bağımsız). Kural silindi, `layout.js`'teki class'lar artık
     kazanıyor.
  2. **Film başlıkları Türkçe geliyordu:** `lib/tmdb.js`'teki
     `language=tr-TR` parametresi TMDB'nin çevrilmiş verisini
     getiriyordu. Kullanıcı orijinal başlıkları tercih etti, parametre
     kaldırıldı.
  Bu düzeltme sırasında koyu tema (bg-gray-950, text-white) `layout.js`
  içine Task 7'den önce, erkenden eklendi (aksi halde Task 4-6 boyunca
  aynı "beyaz üstüne beyaz" sorunu tekrar tekrar yaşanırdı).
- **Sıradaki adım:** Task 4 — Film arama (`src/components/SearchBar.js`).

## 2026-09-02 — Vercel Deploy Sorunu Çözüldü

- Proje Vercel'e bağlıydı ama build'ler `TMDB_API_KEY` ortam
  değişkeni eksik olduğu için başarısız oluyordu (`.env.local` bilerek
  git'e gitmediği için Vercel'in de anahtardan haberi yoktu — beklenen
  bir durum, ilk deploy'da hep yapılması gereken bir adım).
- Vercel Dashboard > Settings > Environment Variables kısmına
  `TMDB_API_KEY` "Secret" tipinde eklendi (Production/Preview/Dev
  hepsi işaretlendi).
- Küçük bir tuzağa düşüldü: "Redeploy" butonu tıklanan spesifik
  deployment'ı yeniden derler, GitHub'daki en son commit'i otomatik
  çekmez. İlk redeploy yanlışlıkla eski (Task 2) commit'e denk geldi,
  asıl en son commit'in (Task 3) başarısız deployment'ı ayrıca
  redeploy edilerek düzeltildi.
- Artık Vercel'deki canlı site, en son kodla (koyu tema, film ızgarası,
  orijinal başlıklar) uyumlu.
- **Sıradaki adım:** Task 4 — Film arama (`src/components/SearchBar.js`).
