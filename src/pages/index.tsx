import { useMemo, type ReactElement } from "react";
import PageContainer from "../components/PageContainer";
import { useQuery } from "@tanstack/react-query";
import { type Pokemon } from "../types/pokemon";
import PokemonCard from "../components/PokemonCard";
import { fromApi } from "../lib/fromApi";
import { PokemonMove } from "../types/move";

function getRandomPokemonId(prevId = 0) {
  return 512;
  const maxIdNumber = 1017;
  const rand = Math.floor(Math.random() * maxIdNumber);
  if (rand === prevId) return getRandomPokemonId(prevId);
  return rand;
}

function generateTwoUniqueRandomNumbers(max: number): [number, number] {
  return [2, 7];
  const rand1 = Math.floor(Math.random() * max);
  const rand2 = Math.floor(Math.random() * max);
  if (rand1 === rand2) return generateTwoUniqueRandomNumbers(max);
  return [rand1, rand2];
}

function fetchPokemon() {
  // 132 is ditto
  const rand = getRandomPokemonId();
  return fromApi<Pokemon>("https://pokeapi.co/api/v2/pokemon/" + rand.toString());
}
function fetchAllPokemon() {
  return fromApi("https://pokeapi.co/api/v2/pokemon", { query: { limit: 1000 } });
}

function getMove(moveUrl: string) {
  return fromApi<PokemonMove>(moveUrl);
}

function usePokemonAndMoves(id: number) {
  const { data: pokemon } = useQuery(["single-pokemon"], fetchPokemon);

  const [selectedMove1, selectedMove2] = useMemo(() => {
    if (!pokemon) return [null, null];
    const len = pokemon.moves.length;
    if (len === 1) return pokemon.moves;
    else if (len === 2) return pokemon.moves;
    else {
      const [rand1, rand2] = generateTwoUniqueRandomNumbers(len);
      return [pokemon.moves[rand1], pokemon.moves[rand2]];
    }
  }, [pokemon?.moves]);

  const { data: move1 } = useQuery(["move", selectedMove1?.move.url], () =>
    selectedMove1 != null ? getMove(selectedMove1.move.url) : undefined,
  );
  const { data: move2 } = useQuery(["move", selectedMove2?.move.url], () =>
    selectedMove2 != null ? getMove(selectedMove2.move.url) : undefined,
  );
  if (!pokemon) return null;
  if (!move1) return null;
  if (!move2 && pokemon.moves.length > 1) return null;

  return { pokemon, move1, move2 };
}

export default function IndexPage(): ReactElement {
  const pokemonAndMoves = usePokemonAndMoves(512);
  return (
    <PageContainer>
      {pokemonAndMoves && (
        <PokemonCard
          pokemon={pokemonAndMoves.pokemon}
          move1={pokemonAndMoves.move1}
          move2={pokemonAndMoves.move2}
        />
      )}
    </PageContainer>
  );
}
