export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-4 text-center text-gray-400 text-sm space-y-1">
        <p>© {new Date().getFullYear()} MovieApp. Tüm hakları saklıdır.</p>
        <p>
          This product uses the TMDB API but is not endorsed or certified by
          TMDB.
        </p>
      </div>
    </footer>
  );
}
