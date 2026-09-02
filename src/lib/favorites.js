import { doc, setDoc, deleteDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function isFavorite(userId, movieId) {
  const ref = doc(db, "favorites", userId, "movies", String(movieId));
  const snap = await getDoc(ref);
  return snap.exists();
}

export async function addFavorite(userId, movie) {
  const ref = doc(db, "favorites", userId, "movies", String(movie.id));
  await setDoc(ref, {
    movieId: movie.id,
    title: movie.title,
    posterPath: movie.poster_path,
    addedAt: Date.now(),
  });
}

export async function removeFavorite(userId, movieId) {
  const ref = doc(db, "favorites", userId, "movies", String(movieId));
  await deleteDoc(ref);
}

export async function getFavorites(userId) {
  const ref = collection(db, "favorites", userId, "movies");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => d.data());
}
