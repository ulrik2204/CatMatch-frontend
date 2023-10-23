import { type ReactElement, useState, useCallback } from "react";
import PokemonCard from "../components/PokemonCard";
import Button from "../components/Button";
import { useLikedPokemon, usePokemonAndMoves } from "../helpers/hooks";

function getRandomPokemonId(prevId = 0) {
  const maxIdNumber = 1017;
  const rand = Math.floor(Math.random() * maxIdNumber);
  if (rand === prevId) return getRandomPokemonId(prevId);
  return rand;
}

export default function IndexPage(): ReactElement {
  const [pokemonId, setPokemonId] = useState(512);
  const pokemonAndMoves = usePokemonAndMoves(pokemonId);
  const { addPokemon } = useLikedPokemon();

  const handleLike = useCallback(() => {
    if (!pokemonAndMoves) return;
    addPokemon(pokemonAndMoves.pokemon.name);
    setPokemonId(getRandomPokemonId(pokemonId));
  }, [addPokemon, pokemonId, pokemonAndMoves]);

  const handleDislike = useCallback(() => {
    if (!pokemonAndMoves) return;
    setPokemonId(getRandomPokemonId(pokemonId));
  }, [addPokemon, pokemonId, pokemonAndMoves]);

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
      </div>
      <div className="flex w-64 flex-row justify-between">
        <Button onClick={handleDislike}>Dislike</Button>
        <div>{pokemonAndMoves?.pokemon.id}</div>
        <Button onClick={handleLike}>Like</Button>
      </div>
    </div>
  );
}
