"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";

function LoginForm() {
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
    <main className="max-w-md mx-auto mt-16 p-8 bg-gray-900 border border-gray-800 rounded-2xl">
      <h1 className="text-3xl font-bold text-white mb-2">Giriş Yap</h1>
      <p className="text-gray-400 mb-8">Favori filmlerine ulaşmak için giriş yap.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm text-gray-300 mb-2">E-posta</label>
          <input
            type="email"
            placeholder="ornek@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-2">Şifre</label>
          <input
            type="password"
            placeholder="Şifreni gir"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700"
        >
          Giriş Yap
        </button>
      </form>
      <p className="text-gray-400 mt-6 text-center">
        Hesabın yok mu?{" "}
        <a href="/signup" className="text-white font-semibold">
          Kayıt ol
        </a>
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-gray-400 p-6">Yükleniyor...</p>}>
      <LoginForm />
    </Suspense>
  );
}
