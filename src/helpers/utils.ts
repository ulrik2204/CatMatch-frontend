import { type Pokemon } from "../types/pokemon";

export function preloadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = img.onabort = function () {
      reject(src);
    };
    img.src = src;
  });
}

export const imageSrcExtractor = (pokemon: Pokemon) =>
  pokemon.sprites.other["official-artwork"].front_default;
