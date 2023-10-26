import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from "react";
import { getMoveFromApi, getPokemonAndMovesFromApi, getPokemonFromApi } from "../lib/fromApi";
import { Pokemon } from "../types/pokemon";
import { PokemonMove } from "../types/move";
import { preview } from "vite";

type StorageObject = typeof window.localStorage | typeof window.sessionStorage;
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
      return JSON.parse(value);
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

export function useSeenPokemon() {
  const [seenPokemonIds, setSeenPokemonIds] = useLocalStorage<number[]>("seenPokemon", []);

  const addSeenPokemonId = (pokemonId: number) => {
    if (seenPokemonIds.includes(pokemonId)) return;
    setSeenPokemonIds((prev) => [...prev, pokemonId]);
  };

  const removeSeenPokemonId = (pokemonId: number) => {
    setSeenPokemonIds((prev) => prev.filter((id) => id !== pokemonId));
  };

  return { seenPokemonIds, addSeenPokemonId, removeSeenPokemonId };
}

function generateRandomNumber(seed: number, cursor: number, min: number, max: number) {
  // Loop around if the cursor is outside of min and max.
  const modularCursor = (cursor % max) + min;

  const combinedSeed = seed ^ modularCursor; // XOR to mix cursor and seed
  const x = Math.sin(combinedSeed) * 10000; // A seeded pseudo-random number generator
  const rawRandom = x - Math.floor(x); // Normalize to [0, 1]

  return min + Math.floor(rawRandom * (max - min));
}

// export function useRandomNumberDistribution(min: number, max: number, seed: number) {

//   const nextRandomNumber = useCallback(
//     (cursor: number) => {
//       setRandomNumber(generateRandomNumber(cursor));
//     },
//     [min, max, seed],
//   );

//   return { randomNumber, nextRandomNumber };
// }

function useRandomPokemonId() {
  const MIN_POKEMON_ID = 1;
  const MAX_POKEMON_ID = 1018;
  const [pokemonIdSeed] = useLocalStorage("pokemonIdSeed", Math.floor(Math.random() * 1000));
  const [pokemonIdCursor, setPokemonIdCursor] = useLocalStorage<number>("pokemonIdCursor", 1);
  const [pokemonId, setPokemonId] = useState<number>(
    generateRandomNumber(pokemonIdSeed, pokemonIdCursor, MIN_POKEMON_ID, MAX_POKEMON_ID),
  );

  const previewNextPokemonId = useCallback(() => {
    return generateRandomNumber(pokemonIdSeed, pokemonIdCursor + 1, MIN_POKEMON_ID, MAX_POKEMON_ID);
  }, [pokemonIdSeed, pokemonIdCursor]);

  const nextPokemonId = useCallback(() => {
    setPokemonId(previewNextPokemonId());
    setPokemonIdCursor((prev) => prev + 1);
  }, [setPokemonId, setPokemonIdCursor, previewNextPokemonId]);

  return { pokemonId, previewNextPokemonId, nextPokemonId };
}

export function usePokemonAndMoves(): {
  data:
    | {
        pokemon: Pokemon;
        move1: PokemonMove;
        move2?: PokemonMove;
      }
    | undefined;
  nextPokemon: () => void;
} {
  const { pokemonId, previewNextPokemonId, nextPokemonId } = useRandomPokemonId();
  console.log("pokeid", pokemonId);
  const queryClient = useQueryClient();
  const { data: pokemonAndMoves } = useQuery(["single-pokemon", pokemonId], () =>
    getPokemonAndMovesFromApi(pokemonId),
  );
  const pokemon = pokemonAndMoves?.pokemon;
  const [move1, move2] = pokemonAndMoves?.moves ?? [undefined, undefined];

  const prefetch = useCallback(() => {
    const nextId = previewNextPokemonId();
    queryClient.prefetchQuery(["single-pokemon", nextId], () => getPokemonAndMovesFromApi(nextId));
  }, [pokemonId, queryClient]);

  // const { data: move1 } = useQuery(["move1", selectedMove1?.move.name], () =>
  //   selectedMove1 != null ? getMoveFromApi(selectedMove1.move.name) : null,
  // );
  // const { data: move2 } = useQuery(["move2", selectedMove2?.move.name], () =>
  //   selectedMove2 != null ? getMoveFromApi(selectedMove2.move.name) : null,
  // );

  const nextPokemon = useCallback(() => {
    nextPokemonId();
  }, [nextPokemonId]);

  useEffect(() => {
    prefetch();
  }, [pokemonId]);

  if (!pokemon || !move1) return { data: undefined, nextPokemon };
  if (!move2 && pokemon.moves.length > 1) return { data: undefined, nextPokemon };

  return { data: { pokemon, move1, move2: move2 ?? undefined }, nextPokemon };
}
