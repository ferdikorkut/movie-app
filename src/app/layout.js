import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "MovieApp",
  description: "TMDB tabanlı film keşif uygulaması",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-950 text-white">
        <AuthProvider>
          <Header />
          <div className="pt-16 flex-1">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
