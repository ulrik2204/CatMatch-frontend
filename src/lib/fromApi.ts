import { type PokemonMove } from "../types/move";
import { type Pokemon } from "../types/pokemon";

export type FromApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Headers;
  body?: Record<string, unknown>;
  query?: Record<string, string | number>;
};

/**
 * A facade for the fetch api which throws an error when the response is not ok.
 * @remarks This function assumes the response is json.
 * @param url The url to make a request to.
 * @param options Options for the request.
 * @returns The json data that was returned from the request.
 */
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

/**
 * A function fetching many pokemon from the api.
 * @param nameOrIdList The name or ids of the pokemon to fetch.
 * @returns A tuple of two lists:
 * 1. A list of the pokemon that were successfully fetched.
 * 2. A list of the reasons why the pokemon could not be fetched.
 * If the 2. list is empty, all pokemon were fetched successfully.
 */
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
      if (pokemon.status === "rejected")
        return [successful, [...rejected, pokemon.reason as string]];
      return [[...successful, pokemon.value], rejected] as [Pokemon[], string[]];
    },
    [[], []] as [Pokemon[], string[]],
  );
  return [successfulPokemon, rejectedPokemonReasons];
}

export async function getPokemonAndMovesFromApi(idOrName: string | number, numberOfMoves = 2) {
  const pokemon = await getPokemonFromApi(idOrName);
  const moves = [];
  for (let i = 0; i < numberOfMoves; i++) {
    if (pokemon.moves.length <= i) break;
    const move = await getMoveFromApi(pokemon.moves[i].move.name);
    moves.push(move);
  }
  return { pokemon, moves };
}
