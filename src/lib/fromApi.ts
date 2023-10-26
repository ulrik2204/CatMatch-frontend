import { idText } from "typescript";
import { PokemonMove } from "../types/move";
import { Pokemon } from "../types/pokemon";

export type FromApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Headers;
  body?: Record<string, unknown>;
  query?: Record<string, string | number>;
};

export function fromApi<T extends Record<string, unknown>>(
  url: string,
  options: FromApiOptions = {},
): Promise<T> {
  const urlWithQuery = new URL(url);
  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      urlWithQuery.searchParams.append(key, value.toString());
    });
  }

  return fetch(urlWithQuery, {
    method: options.method,
    headers: options.headers,
    body: JSON.stringify(options.body),
  }).then((res) => {
    if (res.ok) return res.json() as unknown as T;
    throw new Error(`Request failed with HTTP status code ${res.status}.`);
  });
}

export function getPokemonFromApi(idOrName: string | number) {
  return fromApi<Pokemon>("https://pokeapi.co/api/v2/pokemon/" + idOrName.toString());
}

export function getMoveFromApi(idOrName: string | number) {
  return fromApi<PokemonMove>("https://pokeapi.co/api/v2/move/" + idOrName.toString());
}

export async function getManyPokemonFromApi(
  nameOrIdList: (string | number)[],
): Promise<[Pokemon[], string[]]> {
  const promises = [];
  for (const nameOrId of nameOrIdList) {
    promises.push(getPokemonFromApi(nameOrId));
  }
  const settled = await Promise.allSettled(promises);
  const [successfulPokemon, rejectedPokemonReasons] = settled.reduce(
    (result, pokemon) => {
      const [successful, rejected] = result;
      if (pokemon.status === "rejected") return [successful, [...rejected, pokemon.reason]];
      return [[...successful, pokemon.value], rejected] as [Pokemon[], string[]];
    },
    [[], []] as [Pokemon[], string[]],
  );
  return [successfulPokemon, rejectedPokemonReasons];
}

export async function getPokemonAndMovesFromApi(
  idOrName: string | number,
  numberOfMoves: number = 2,
) {
  const pokemon = await getPokemonFromApi(idOrName);
  const moves = [];
  for (let i = 0; i < numberOfMoves; i++) {
    if (pokemon.moves.length <= i) break;
    const move = await getMoveFromApi(pokemon.moves[i].move.name);
    moves.push(move);
  }
  return { pokemon, moves };
}
