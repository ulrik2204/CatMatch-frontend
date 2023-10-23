import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { getMoveFromApi, getPokemonFromApi } from "../lib/fromApi";
import { Pokemon } from "../types/pokemon";
import { PokemonMove } from "../types/move";

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

export function usePokemonAndMoves(idOrName: string | number): {
  pokemon: Pokemon;
  move1: PokemonMove;
  move2?: PokemonMove;
} | null {
  const { data: pokemon } = useQuery(["single-pokemon", idOrName], () =>
    getPokemonFromApi(idOrName),
  );

  const [selectedMove1, selectedMove2] = useMemo(() => {
    if (!pokemon || pokemon.moves.length === 0) return [null, null];
    if (pokemon.moves.length === 1) return [pokemon.moves[0], null];
    return pokemon.moves.slice(0, 2);
  }, [pokemon?.moves]);

  const { data: move1 } = useQuery(["move1", selectedMove1?.move.name], () =>
    selectedMove1 != null ? getMoveFromApi(selectedMove1.move.name) : null,
  );
  const { data: move2 } = useQuery(["move2", selectedMove2?.move.name], () =>
    selectedMove2 != null ? getMoveFromApi(selectedMove2.move.name) : null,
  );
  if (!pokemon || !move1) return null;
  if (!move2 && pokemon.moves.length > 1) return null;

  return { pokemon, move1, move2: move2 ?? undefined };
}
