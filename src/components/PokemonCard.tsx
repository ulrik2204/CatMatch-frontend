import { useQuery } from "@tanstack/react-query";
import { fromApi } from "../lib/fromApi";
import { type PokemonMove } from "../types/move";
import { type Pokemon, type Move } from "../types/pokemon";
import { type ReactElement, useMemo } from "react";

type PokemonCardProps = {
  pokemon: Pokemon;
};
function generateTwoUniqueRandomNumbers(max: number): [number, number] {
  const rand1 = Math.floor(Math.random() * max);
  const rand2 = Math.floor(Math.random() * max);
  if (rand1 === rand2) return generateTwoUniqueRandomNumbers(max);
  return [rand1, rand2];
}

export default function PokemonCard({ pokemon }: PokemonCardProps): ReactElement {
  const selectedMoves = useMemo(() => {
    const len = pokemon.moves.length;
    if (len === 1) return pokemon.moves;
    else if (len === 2) return pokemon.moves;
    else {
      const [rand1, rand2] = generateTwoUniqueRandomNumbers(len);
      return [pokemon.moves[rand1], pokemon.moves[rand2]];
    }
  }, [pokemon.moves]);
  return (
    <div className="h-56 w-32">
      <h1 className="font-bold capitalize">{pokemon.name}</h1>
      <div>{/* Insert image here */}</div>
      {selectedMoves.map((move) => (
        <Move key={move.move.name} move={move} />
      ))}
    </div>
  );
}

function getMove(moveUrl: string) {
  return fromApi<PokemonMove>(moveUrl);
}

function Move({ move }: { move: Move }) {
  const { data } = useQuery(["move", move.move.url], () => getMove(move.move.url));

  const flavorText = useMemo(() => {
    const moves = data?.flavor_text_entries ?? [];
    const a = moves.reverse().find((entry) => entry.language.name === "en");
    return a?.flavor_text ?? "";
  }, [data]);

  return (
    <div>
      <h3 className="font-bold capitalize">{move.move.name}</h3>
      {/* Can also use english flovor text */}
      <p className="text-xs">{flavorText}</p>
    </div>
  );
}
