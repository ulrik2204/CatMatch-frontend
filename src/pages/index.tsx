import { useCallback, type ReactElement } from "react";
import Button from "../components/Button";
import PokemonCard from "../components/PokemonCard";
import Swipeable from "../components/Swipeable";
import { MAX_POKEMON_ID } from "../helpers/constants";
import { useLikedPokemon, usePokemonIdCursor, useRandomPokemonAndMoves } from "../helpers/hooks";
import { imageSrcExtractor } from "../helpers/utils";

export default function IndexPage(): ReactElement {
  const { data: pokemonAndMoves, nextPokemon } = useRandomPokemonAndMoves(imageSrcExtractor);
  const { pokemonIdCursor } = usePokemonIdCursor();
  const { addPokemon } = useLikedPokemon();

  const handleLike = useCallback(() => {
    if (!pokemonAndMoves) return;
    addPokemon(pokemonAndMoves.pokemon.name);
    nextPokemon();
  }, [addPokemon, pokemonAndMoves, nextPokemon]);

  const handleDislike = useCallback(() => {
    if (!pokemonAndMoves) return;
    nextPokemon();
  }, [pokemonAndMoves, nextPokemon]);

  return (
    <div className="flex flex-col items-center pt-16">
      <div className="flex flex-col items-center sm:w-1 lg:w-1/3">
        {pokemonAndMoves && (
          <Swipeable onLike={handleLike} onDislike={handleDislike}>
            <PokemonCard
              pokemon={pokemonAndMoves.pokemon}
              move1={pokemonAndMoves.move1}
              move2={pokemonAndMoves.move2}
              imageSrcExtractor={imageSrcExtractor}
            />
          </Swipeable>
        )}
        {pokemonIdCursor === MAX_POKEMON_ID && <div>Out of Pokemon!</div>}
      </div>
      <div className="flex w-64 flex-row justify-between">
        <Button onClick={handleDislike} color="secondary">
          Dislike
        </Button>
        <Button onClick={handleLike}>Like</Button>
      </div>
    </div>
  );
}
