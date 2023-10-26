import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { getPokemonAndMovesFromApi } from "../lib/fromApi";
import { type PokemonMove } from "../types/move";
import { type Pokemon } from "../types/pokemon";
import { MAX_POKEMON_ID, MIN_POKEMON_ID } from "./constants";

type StorageObject = typeof window.localStorage;
// useStorage, useLocalStorage and useSessionStorage is taken from, but translated to typescript:
// https://github.com/WebDevSimplified/useful-custom-react-hooks/blob/main/src/8-useStorage/useStorage.js

/**
 * Hook to handle operations with localStorage
 * @param key The key of the object in the storageObject
 * @param defaultValue The default value of the item in the storageObject
 * @param storageObject Either localStorage or sessionStorage
 * @returns An array of [value, setValue, remove]
 */
function useStorage<ValueType>(
  key: string,
  defaultValue: ValueType,
  storageObject: StorageObject,
): [ValueType, Dispatch<SetStateAction<ValueType>>] {
  const [value, setValue] = useState<ValueType>(() => {
    const value = storageObject.getItem(key);
    if (value != null) {
      return JSON.parse(value) as ValueType;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (value === undefined) return storageObject.removeItem(key);
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  return [value, setValue];
}

/**
 * Handling operations with localStorage
 * @param key The key of the object in localStorage
 * @param defaultValue The default value of the item in localStorage.
 * @returns An array of [value, setValue, remove]
 */
export function useLocalStorage<ValueType>(key: string, defaultValue: ValueType) {
  return useStorage(key, defaultValue, window.localStorage);
}

/**
 * Handling operations with sessionStorage
 * @param key The key of the object in sessionStorage
 * @param defaultValue The default value of the item in sessionStorage.
 * @returns An array of [value, setValue, remove]
 */
export function useSessionStorage<ValueType>(key: string, defaultValue: ValueType) {
  return useStorage(key, defaultValue, window.sessionStorage);
}

export function useLikedPokemon() {
  const [likedPokemonNames, setLikedPokemon] = useLocalStorage<string[]>("likedPokemon", []);

  const addPokemon = (pokemonName: string) => {
    if (likedPokemonNames.includes(pokemonName)) return;
    setLikedPokemon((prev) => [...prev, pokemonName]);
  };

  const removePokemon = (pokemonName: string) => {
    setLikedPokemon((prev) => prev.filter((name) => name !== pokemonName));
  };

  return { likedPokemonNames, addPokemon, removePokemon };
}

/**
 * Function to generate a random number between min and max, based on a seed and a cursor.
 * @param randomSeed A seed to generate the random number from. Should be a stored true random number.
 * @param cursor A value representing which number in a sequence to return.
 * @param min The minimum number (inclusive) to return.
 * @param max The maximum number (exclusive) to return.
 * @returns A random number between min and max.
 * The function will always return the same number for the same seed and cursor,
 * but the values will be unique for a constant seed and a changing cursor between min and max.
 *
 */
function generateRandomNumber(randomSeed: number, cursor: number, min: number, max: number) {
  // Loop around if the cursor is outside of min or max.
  const modularCursor = (cursor % max) + min;

  const combinedSeed = randomSeed ^ modularCursor; // XOR to mix cursor and seed
  const x = Math.sin(combinedSeed) * 10000; // A seeded pseudo-random number generator
  const rawRandom = x - Math.floor(x); // Normalize to [0, 1]

  return min + Math.floor(rawRandom * (max - min));
}

export function usePokemonIdCursor() {
  const [pokemonIdCursor, setPokemonIdCursor] = useLocalStorage<number>("pokemonIdCursor", 1);

  const incrementPokemonIdCursor = useCallback(() => {
    setPokemonIdCursor((prev) => prev + 1);
  }, [setPokemonIdCursor]);
  return { pokemonIdCursor, incrementPokemonIdCursor };
}

function useRandomPokemonId() {
  const [pokemonIdSeed] = useLocalStorage("pokemonIdSeed", Math.floor(Math.random() * 1000));
  const { pokemonIdCursor, incrementPokemonIdCursor } = usePokemonIdCursor();
  const [pokemonId, setPokemonId] = useState<number>(
    generateRandomNumber(pokemonIdSeed, pokemonIdCursor, MIN_POKEMON_ID, MAX_POKEMON_ID + 1),
  );

  const previewNextPokemonId = useCallback(() => {
    return generateRandomNumber(
      pokemonIdSeed,
      pokemonIdCursor + 1,
      MIN_POKEMON_ID,
      MAX_POKEMON_ID + 1,
    );
  }, [pokemonIdSeed, pokemonIdCursor]);

  const nextPokemonId = useCallback(() => {
    setPokemonId(previewNextPokemonId());
    incrementPokemonIdCursor();
  }, [setPokemonId, incrementPokemonIdCursor, previewNextPokemonId]);

  return { pokemonId, previewNextPokemonId, nextPokemonId };
}

export function usePokemonAndMoves(
  idOrName: number | string,
  imageSrcExtractorForImagePreloading?: (pokemon: Pokemon) => string,
) {
  const { data: pokemonAndMoves } = useQuery(["single-pokemon", idOrName], () =>
    getPokemonAndMovesFromApi(idOrName, 2, imageSrcExtractorForImagePreloading),
  );
  const pokemon = pokemonAndMoves?.pokemon;
  const [move1, move2] = pokemonAndMoves?.moves ?? [undefined, undefined];

  if (!pokemon || !move1) return undefined;
  if (!move2 && pokemon.moves.length > 1) return undefined;

  return { pokemon, move1, move2: move2 ?? undefined };
}

export function useRandomPokemonAndMoves(
  imageSrcExtractorForImagePreloading?: (pokemon: Pokemon) => string,
): {
  data: { pokemon: Pokemon; move1: PokemonMove; move2?: PokemonMove } | undefined;
  nextPokemon: () => void;
} {
  const queryClient = useQueryClient();
  const { pokemonId, previewNextPokemonId, nextPokemonId } = useRandomPokemonId();
  const pokemonAndMoves = usePokemonAndMoves(pokemonId, imageSrcExtractorForImagePreloading);

  const prefetch = useCallback(async () => {
    const nextId = previewNextPokemonId();
    await queryClient.prefetchQuery(["single-pokemon", nextId], () =>
      getPokemonAndMovesFromApi(nextId, 2, imageSrcExtractorForImagePreloading),
    );
  }, [pokemonId, queryClient, previewNextPokemonId]);

  const nextPokemon = useCallback(() => {
    nextPokemonId();
  }, [nextPokemonId]);

  useEffect(() => {
    prefetch().catch((err) => console.error(err));
  }, [pokemonId, prefetch]);

  return { data: pokemonAndMoves, nextPokemon };
}
