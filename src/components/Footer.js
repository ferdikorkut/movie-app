export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-6 py-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} MovieApp. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
