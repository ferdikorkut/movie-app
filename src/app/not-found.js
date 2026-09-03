import Link from "next/link";

export default function NotFound() {
  return (
    <main className="max-w-2xl mx-auto p-6 flex flex-col items-center text-center">
      <img src="/404.gif" alt="404" className="rounded-lg mb-6" />
      <h1 className="text-2xl font-bold text-white mb-2">Sayfa Bulunamadı</h1>
      <p className="text-gray-400 mb-6">
        Aradığın sayfa mevcut değil ya da taşınmış olabilir.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-full bg-red-600 text-white font-medium hover:bg-red-700"
      >
        Ana Sayfaya Dön
      </Link>
    </main>
  );
}
