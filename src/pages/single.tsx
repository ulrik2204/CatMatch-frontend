import { useParams } from "react-router-dom";
import { usePokemonAndMoves } from "../helpers/hooks";
import PokemonCard from "../components/PokemonCard";

export default function SinglePokemonCardPage() {
  const params = useParams();
  const idOrName = params.idOrName;
  const pokemonAndMoves = usePokemonAndMoves(idOrName ?? 512);
  return (
    <div className="flex flex-col items-center pt-16">
      {pokemonAndMoves && (
        <PokemonCard
          pokemon={pokemonAndMoves.pokemon}
          move1={pokemonAndMoves.move1}
          move2={pokemonAndMoves.move2}
        />
      )}
    </div>
  );
}
