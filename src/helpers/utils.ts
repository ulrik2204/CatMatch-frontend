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

export const generateRandomUserId = () => {
  const choices = "abcdefghijklmnopqrstuvwxyz";
  const length = 12;

  let userId = "";
  for (let i = 0; i < length; i++) {
    userId += choices[Math.floor(choices.length * Math.random())];
  }

  return userId;
};
