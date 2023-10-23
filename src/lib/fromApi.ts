import { idText } from "typescript";
import { PokemonMove } from "../types/move";
import { Pokemon } from "../types/pokemon";

// TODO: Implement fromApi
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
