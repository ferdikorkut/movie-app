"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(credential.user, { displayName: name });
      router.push("/");
    } catch (err) {
      setError("Kayıt başarısız: " + err.message);
    }
  }

  return (
    <main className="max-w-md mx-auto mt-16 p-8 bg-gray-900 border border-gray-800 rounded-2xl">
      <h1 className="text-3xl font-bold text-white mb-2">Kayıt Ol</h1>
      <p className="text-gray-400 mb-8">Hesap oluştur, favori filmlerini kaydet.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label className="block text-sm text-gray-300 mb-2">Ad Soyad</label>
          <input
            type="text"
            placeholder="Ali Yılmaz"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
        </div>
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
            placeholder="En az 6 karakter"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-gray-800 text-white border border-gray-700 placeholder-gray-500 focus:outline-none focus:border-red-500"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700"
        >
          Kayıt Ol
        </button>
      </form>
      <p className="text-gray-400 mt-6 text-center">
        Zaten hesabın var mı?{" "}
        <a href="/login" className="text-white font-semibold">
          Giriş yap
        </a>
      </p>
    </main>
  );
}
