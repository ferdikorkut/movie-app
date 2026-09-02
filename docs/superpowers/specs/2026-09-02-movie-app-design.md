# Movie App — Tasarım Belgesi (Design Spec)

**Tarih:** 2026-09-02
**Durum:** Onaylandı, uygulamaya (implementation plan) geçiliyor

## Amaç

TheMovieDB (TMDB) API'sini kullanan bir film keşif uygulaması. Herkes
popüler filmleri görebilir ve arama yapabilir. Bir filmin detayına
girmek ve favorilere eklemek için Firebase Auth ile e-posta/şifre
girişi gerekir.

## Teknoloji Yığını

- **Next.js** (App Router), **JavaScript** (TypeScript değil)
- **Tailwind CSS** — stil
- **Firebase Auth** — e-posta/şifre ile kayıt/giriş
- **Firebase Firestore** — kullanıcı başına favori film listesi
- **TMDB API** — popüler filmler, arama, film detayı
- **Vercel** — yayınlama (deployment) hedefi (ileride konuşulacak)

## Güvenlik Yaklaşımı

- TMDB API anahtarı `.env.local` içinde saklanır, sadece Next.js
  Server Component'lerinden erişilir; tarayıcıya hiç gönderilmez.
- Firebase istemci anahtarları (apiKey vb.) tarayıcıda görünür
  olabilir — bu Firebase'in normal çalışma şeklidir. Gerçek güvenlik,
  Firestore Security Rules ile sağlanır: bir kullanıcı yalnızca kendi
  `favorites/{userId}/...` verisini okuyup yazabilir.
- `.env.local` dosyası `.gitignore` içinde olacak, repoya asla commit
  edilmeyecek.

## Sayfa Yapısı (Routing)

| Route | Sayfa | Erişim |
|---|---|---|
| `/` | Filmler (popüler filmler + arama) | Herkes |
| `/film/[id]` | Film detayı | Sadece giriş yapmış kullanıcı |
| `/favorilerim` | Favorilerim | Sadece giriş yapmış kullanıcı |
| `/giris` | Giriş Yap | Herkes |
| `/kayit` | Kayıt Ol | Herkes |

### Üst Menü (tüm sayfalarda sabit layout)

- Sol: Logo
- Orta: "Filmler" / "Favorilerim" linkleri
- Sağ: Giriş yapılmamışsa "Giriş Yap" butonu; giriş yapılmışsa
  kullanıcının Ad Soyad'ı + "Çıkış Yap" butonu

### Filmler Sayfası

- Sol üst: "Popüler Filmler" başlığı
- Sağ üst: Arama input'u + Ara butonu
- Altında: TMDB'den gelen popüler filmlerin kart (poster + başlık)
  ızgarası

## Kimlik Doğrulama Akışı

1. Kullanıcı bir filme tıklar (`/film/[id]`).
2. `AuthContext` (React Context) üzerinden giriş durumu kontrol
   edilir.
3. Giriş yapılmamışsa `/giris` sayfasına yönlendirilir; giriş
   yaptıktan sonra kaldığı filme geri döner.
4. Giriş yapılmışsa film detayı gösterilir, "Favorilere Ekle" butonu
   aktif olur.
5. Kayıt sırasında ad-soyad Firebase `displayName` alanına yazılır ve
   menüde bu isim gösterilir.

## Veri Katmanı

**TMDB API çağrıları (Server Component içinde, sunucu tarafında):**
- `GET /movie/popular` — popüler filmler
- `GET /search/movie?query=...` — arama
- `GET /movie/{id}` — film detayı

**Firestore veri modeli:**
- Koleksiyon yolu: `favorites/{userId}/movies/{movieId}`
- Alanlar: `movieId`, `title`, `posterPath`, `addedAt`
- Firestore Security Rules: bir kullanıcı sadece
  `favorites/{kendi userId'si}` altına okuma/yazma yapabilir.

## Favoriler Akışı

- Film detay sayfasında "Favorilere Ekle" / "Favorilerden Çıkar"
  butonu (Firestore'daki mevcut duruma göre metni değişir).
- Tıklanınca Firestore'a yazılır/silinir, buton anında güncellenir.
- `/favorilerim` sayfası, giriş yapan kullanıcının Firestore'daki
  favorilerini aynı kart ızgarasıyla listeler. Liste boşsa "Henüz
  favori filmin yok" mesajı gösterilir.

## Klasör Yapısı

```
movie-app/
├── app/
│   ├── layout.js
│   ├── page.js
│   ├── film/[id]/page.js
│   ├── favorilerim/page.js
│   ├── giris/page.js
│   └── kayit/page.js
├── components/
│   ├── Header.js
│   ├── MovieCard.js
│   ├── MovieGrid.js
│   ├── SearchBar.js
│   └── FavoriteButton.js
├── lib/
│   ├── firebase.js
│   ├── tmdb.js
│   └── auth-context.js
├── .env.local
└── docs/
    └── GUNLUK.md
```

## Proje Günlüğü

`docs/GUNLUK.md` dosyasında, her önemli adımdan sonra tarihli kısa
notlar tutulacak (ne yapıldı, hangi kararlar alındı, sıradaki adım
ne). Bu dosya, oturumlar arasında "nerede kalındığını" hatırlamak
için kullanılacak.

## Doğrulama Yaklaşımı

Otomatik test yazılmayacak (kapsam görsel/arayüz ağırlıklı ve proje
öğrenme amaçlı). Her özellik `npm run dev` ile gerçek tarayıcıda
birlikte denenerek doğrulanacak.

## Kapsam Dışı (v1 için, sonra eklenebilir)

- Google ile giriş
- Film detayında oyuncu kadrosu (cast) ve fragman (trailer)
- Otomatik testler
- Deployment/CI detayları
