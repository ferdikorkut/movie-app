# MovieApp

TMDB API'sinden film verisi çeken, Firebase ile kullanıcı girişi ve
favori film listesi özellikleri olan bir film keşif uygulaması.

## Kullandığımız Teknolojiler

- **Next.js** (App Router, JavaScript) — web uygulamasının altyapısı
- **Tailwind CSS** — stil/tasarım
- **Firebase Auth** — kullanıcı kayıt/giriş (e-posta + şifre)
- **Firebase Firestore** — favori filmlerin saklandığı veritabanı
- **TMDB API** (themoviedb.org) — popüler filmler, arama, film detayı
- **Vercel** — sitenin canlı yayınlandığı yer (deployment)
- **GitHub** — kodun saklandığı depo (version control)

## Hangi Siteden Ne Aldık

| Site | Ne İçin Kullandık | Ücret |
|---|---|---|
| [themoviedb.org](https://www.themoviedb.org) | Film verisi çeken API hizmeti | Ücretsiz |
| [console.firebase.google.com](https://console.firebase.google.com) | Kullanıcı girişi (Authentication) + favori veritabanı (Firestore) | Ücretsiz (Spark planı) |
| [vercel.com](https://vercel.com) | Sitenin canlı yayınlanması, GitHub'a her push'ta otomatik güncellenir | Ücretsiz |
| [github.com](https://github.com) | Kodun yedeklendiği/saklandığı yer | Ücretsiz |

## Bu Proje İçin Açılan Hesaplar / Projeler

- **TMDB hesabı** — API anahtarı buradan alındı (Settings > API)
- **Firebase projesi** — Authentication (Email/Password) ve Firestore Database etkinleştirildi
- **Vercel projesi** — GitHub reposuna (`ferdikorkut/movie-app`) bağlı, `main` branch'ine her push otomatik canlıya yansır

## Ortam Değişkenleri (.env.local)

Proje yerelde çalışırken şu değerlere ihtiyaç duyuyor (bu dosya git'e
hiç gitmez, sadece bilgisayarında durur):

```
TMDB_API_KEY=...

NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

Aynı değerler, canlı site çalışsın diye Vercel'de de **Settings >
Environment Variables** kısmına ayrıca eklenmiştir.

## Yerelde Çalıştırma

```bash
npm install
npm run dev
```

Sonra tarayıcıda [http://localhost:3000](http://localhost:3000) adresini aç.

## Daha Detaylı Notlar

- `docs/GUNLUK.md` — projenin gün gün ilerleme günlüğü: hangi kararın
  neden alındığı, karşılaşılan hatalar ve çözümleri
- `docs/superpowers/specs/2026-09-02-movie-app-design.md` — orijinal
  tasarım belgesi
- `docs/superpowers/plans/2026-09-02-movie-app-mvp.md` — adım adım
  uygulama planı
