import { type ReactElement, useState, useCallback } from "react";
import PokemonCard from "../components/PokemonCard";
import Button from "../components/Button";
import { useLikedPokemon, usePokemonAndMoves, useSeenPokemon } from "../helpers/hooks";

function getRandomPokemonId(prevIds: number[]) {
  const maxIdNumber = 1017;
  if (prevIds.length === maxIdNumber) return -1;
  const rand = Math.floor(Math.random() * maxIdNumber);
  if (rand in prevIds) return getRandomPokemonId([...prevIds, rand]);
  return rand;
}

export default function IndexPage(): ReactElement {
  const { data: pokemonAndMoves, nextPokemon } = usePokemonAndMoves();
  const { addPokemon } = useLikedPokemon();

  const handleLike = useCallback(() => {
    if (!pokemonAndMoves) return;
    addPokemon(pokemonAndMoves.pokemon.name);
    nextPokemon();
  }, [addPokemon, pokemonAndMoves]);

  const handleDislike = useCallback(() => {
    if (!pokemonAndMoves) return;
    nextPokemon();
  }, [addPokemon, pokemonAndMoves]);

  return (
    <div className="flex flex-col items-center pt-16">
      <div className="flex h-96 flex-col items-center">
        {pokemonAndMoves && (
          <PokemonCard
            pokemon={pokemonAndMoves.pokemon}
            move1={pokemonAndMoves.move1}
            move2={pokemonAndMoves.move2}
          />
        )}
        {/* {pokemonId === -1 && <div>Out of Pokemon!</div>} */}
      </div>
      <div className="flex w-64 flex-row justify-between">
        <Button onClick={handleDislike}>Dislike</Button>
        <div>{pokemonAndMoves?.pokemon.id}</div>
        <Button onClick={handleLike}>Like</Button>
      </div>
    </div>
  );
}
