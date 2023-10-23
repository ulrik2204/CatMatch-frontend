import { useMemo, type ReactElement, useState, useCallback } from "react";
import PageContainer from "../components/PageContainer";
import { useQuery } from "@tanstack/react-query";
import PokemonCard from "../components/PokemonCard";
import { getMoveFromApi, getPokemonFromApi } from "../lib/fromApi";
import Button from "../components/Button";
import { useLikedPokemon } from "../helpers/hooks";

function getRandomPokemonId(prevId = 0) {
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

export default function IndexPage(): ReactElement {
  const [pokemonId, setPokemonId] = useState(512);
  const pokemonAndMoves = usePokemonAndMoves(pokemonId);
  const { addPokemon } = useLikedPokemon();

  const handleLike = useCallback(() => {
    addPokemon(pokemonId);
    setPokemonId(getRandomPokemonId(pokemonId));
  }, [addPokemon, pokemonId]);

  const handleDislike = useCallback(() => {
    addPokemon(pokemonId);
    setPokemonId(getRandomPokemonId(pokemonId));
  }, [addPokemon, pokemonId]);

  return (
    <div className="pt-16">
      <div className="flex h-96 flex-col items-center">
        {pokemonAndMoves && (
          <PokemonCard
            pokemon={pokemonAndMoves.pokemon}
            move1={pokemonAndMoves.move1}
            move2={pokemonAndMoves.move2}
          />
        )}
      </div>
      <div className="flex w-64 flex-row justify-between">
        <Button onClick={handleDislike}>Dislike</Button>
        <div>{pokemonAndMoves?.pokemon.id}</div>
        <Button onClick={handleLike}>Like</Button>
      </div>
    </div>
  );
}
