import { type ReactElement } from "react";
import PageContainer from "../components/PageContainer";
import { useQuery } from "@tanstack/react-query";
import { type Pokemon } from "../util/types";
import PokemonCard from "../components/PokemonCard";

function getRandomPokemonId(prevId = 0) {
  const maxIdNumber = 1017;
  const rand = Math.floor(Math.random() * maxIdNumber);
  if (rand === prevId) return getRandomPokemonId(prevId);
  return rand;
}

function fetchPokemon() {
  // 132 is ditto
  return fetch("https://pokeapi.co/api/v2/pokemon/132").then((res) => res.json());
}
function fetchAllPokemon() {
  return fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=1000").then((res) => res.json());
}

export default function IndexPage(): ReactElement {
  const { data } = useQuery<Pokemon>(["single-pokemon"], fetchPokemon);
  return <PageContainer>{data && <PokemonCard pokemon={data} />}</PageContainer>;
}
