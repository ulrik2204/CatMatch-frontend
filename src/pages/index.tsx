import { useCallback, type ReactElement } from "react";
import Button from "../components/Button";
import PokemonCard from "../components/PokemonCard";
import { MAX_POKEMON_ID } from "../helpers/constants";
import { useLikedPokemon, usePokemonIdCursor, useRandomPokemonAndMoves } from "../helpers/hooks";

export default function IndexPage(): ReactElement {
  const { data: pokemonAndMoves, nextPokemon } = useRandomPokemonAndMoves();
  const { pokemonIdCursor } = usePokemonIdCursor();
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
        {pokemonIdCursor === MAX_POKEMON_ID && <div>Out of Pokemon!</div>}
      </div>
      <div className="flex w-64 flex-row justify-between">
        <Button onClick={handleDislike} color="secondary">
          Dislike
        </Button>
        <div>{pokemonAndMoves?.pokemon.id}</div>
        <Button onClick={handleLike}>Like</Button>
      </div>
    </div>
  );
}
