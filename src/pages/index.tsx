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
  const [pokemonId, setPokemonId] = useState(getRandomPokemonId([-1]));
  const pokemonAndMoves = usePokemonAndMoves(pokemonId);
  const { addPokemon } = useLikedPokemon();
  const { seenPokemonIds, addSeenPokemonId } = useSeenPokemon();

  const handleLike = useCallback(() => {
    if (!pokemonAndMoves) return;
    addPokemon(pokemonAndMoves.pokemon.name);
    addSeenPokemonId(pokemonId);
    setPokemonId(getRandomPokemonId([...seenPokemonIds, pokemonId]));
  }, [addPokemon, pokemonId, pokemonAndMoves]);

  const handleDislike = useCallback(() => {
    if (!pokemonAndMoves) return;
    addSeenPokemonId(pokemonId);
    setPokemonId(getRandomPokemonId([...seenPokemonIds, pokemonId]));
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
