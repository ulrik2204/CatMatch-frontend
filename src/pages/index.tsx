import { type ReactElement } from "react";
import PageContainer from "../components/PageContainer";
import { useQuery } from "@tanstack/react-query";
import { type Pokemon } from "../types/pokemon";
import PokemonCard from "../components/PokemonCard";
import { fromApi } from "../lib/fromApi";

function getRandomPokemonId(prevId = 0) {
  const maxIdNumber = 1017;
  const rand = Math.floor(Math.random() * maxIdNumber);
  if (rand === prevId) return getRandomPokemonId(prevId);
  return rand;
}

function fetchPokemon() {
  // 132 is ditto
  return fromApi<Pokemon>("https://pokeapi.co/api/v2/pokemon/1");
}
function fetchAllPokemon() {
  return fromApi("https://pokeapi.co/api/v2/pokemon", { query: { limit: 1000 } });
}

export default function IndexPage(): ReactElement {
  const { data } = useQuery(["single-pokemon"], fetchPokemon);
  return <PageContainer>{data && <PokemonCard pokemon={data} />}</PageContainer>;
}
