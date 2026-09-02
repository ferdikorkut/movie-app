"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ defaultValue = "" }) {
  const [value, setValue] = useState(defaultValue);
  const router = useRouter();

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = value.trim();
    router.push(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Film ara..."
        className="px-3 py-2 rounded bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-blue-500"
      />
      <button
        type="submit"
        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
      >
        Ara
      </button>
    </form>
  );
}
