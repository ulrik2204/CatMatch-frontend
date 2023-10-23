import { useMemo, type ReactElement, useState } from "react";
import PageContainer from "../components/PageContainer";
import { useQuery } from "@tanstack/react-query";
import PokemonCard from "../components/PokemonCard";
import { getMoveFromApi, getPokemonFromApi } from "../lib/fromApi";
import Button from "../components/Button";

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

function usePokemonAndMoves(id: number) {
  const { data: pokemon } = useQuery(["single-pokemon", id], () => getPokemonFromApi(id));

  const [selectedMove1, selectedMove2] = useMemo(() => {
    if (!pokemon) return [null, null];

    const moveCount = pokemon.moves.length;
    if (moveCount === 1) return pokemon.moves;
    else if (moveCount === 2) return pokemon.moves;

    const [rand1, rand2] = generateTwoUniqueRandomNumbers(moveCount);
    return [pokemon.moves[rand1], pokemon.moves[rand2]];
  }, [pokemon?.moves]);

  const { data: move1 } = useQuery(["move1", selectedMove1?.move.name], () =>
    selectedMove1 != null ? getMoveFromApi(selectedMove1.move.name) : undefined,
  );
  const { data: move2 } = useQuery(["move2", selectedMove2?.move.name], () =>
    selectedMove2 != null ? getMoveFromApi(selectedMove2.move.name) : undefined,
  );
  if (!pokemon || !move1) return null;
  if (!move2 && pokemon.moves.length > 1) return null;

  return { pokemon, move1, move2 };
}

export default function IndexPage(): ReactElement {
  const [pokemonId, setPokemonId] = useState(512);
  const pokemonAndMoves = usePokemonAndMoves(pokemonId);
  return (
    <div>
      {pokemonAndMoves && (
        <PokemonCard
          pokemon={pokemonAndMoves.pokemon}
          move1={pokemonAndMoves.move1}
          move2={pokemonAndMoves.move2}
        />
      )}
      <div className="flex flex-row justify-between">
        <Button onClick={() => setPokemonId((prev) => prev - 1)}>Previous</Button>
        <div>{pokemonAndMoves?.pokemon.id}</div>
        <Button onClick={() => setPokemonId((prev) => prev + 1)}>Next</Button>
      </div>
    </div>
  );
}
