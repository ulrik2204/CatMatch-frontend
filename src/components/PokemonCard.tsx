import { useQuery } from "@tanstack/react-query";
import { fromApi } from "../lib/fromApi";
import { type PokemonMove } from "../types/move";
import { type Pokemon, type Move } from "../types/pokemon";
import { type ReactElement, useMemo } from "react";

type PokemonCardProps = {
  pokemon: Pokemon;
};
function generateTwoUniqueRandomNumbers(max: number): [number, number] {
  return [2, 7];
  const rand1 = Math.floor(Math.random() * max);
  const rand2 = Math.floor(Math.random() * max);
  if (rand1 === rand2) return generateTwoUniqueRandomNumbers(max);
  return [rand1, rand2];
}

export default function PokemonCard({ pokemon }: PokemonCardProps): ReactElement {
  console.log("types", pokemon.types);
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
    <div className="flex h-80 w-56 flex-col items-center justify-center rounded border bg-pokeborder p-2">
      <div className="flex h-full w-full flex-col items-center rounded bg-pokebackground">
        <div className="flex w-11/12 flex-col">
          <h2 className="font-bold capitalize">{pokemon.name}</h2>
          <div className="flex h-32 w-full flex-col items-center justify-center rounded border-4 border-gray-400 bg-white">
            <img
              src={pokemon.sprites.other["official-artwork"].front_default}
              alt="Picture"
              className="h-28 object-contain"
            />
            <div className="flex h-2 w-full items-center justify-center bg-gray-300 text-[0.4rem]">
              {/* Number, height, width */}
              No: {pokemon.id} | H: {pokemon.height} | W: {pokemon.weight}
            </div>
          </div>
          {selectedMoves.map((move) => (
            <div key={move.move.name}>
              <Move move={move} />
              <div className="h-1"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getMove(moveUrl: string) {
  return fromApi<PokemonMove>(moveUrl);
}

function formatMoveFlavorText(flavorText: string) {
  const maximumLength = 100;
  if (flavorText.length < maximumLength) return flavorText;
  const sentences = flavorText.split(".");
  let selectedText = "";
  while (true) {
    const nextSentence = sentences.shift();
    if (!nextSentence) break;
    if (selectedText.length + nextSentence.length > maximumLength) break;
    selectedText += nextSentence + ". ";
  }
  return selectedText;
}

function Move({ move }: { move: Move }) {
  // TODO: make this input to PokemonCard instead of doing the request here
  const { data } = useQuery(["move", move.move.url], () => getMove(move.move.url));

  const flavorText = useMemo(() => {
    const moves = data?.flavor_text_entries ?? [];
    const selectedText = moves
      .slice() // To create a copy of the array
      .reverse()
      .find((entry) => entry.language.name === "en");
    if (!selectedText) return "";
    return formatMoveFlavorText(selectedText.flavor_text);
  }, [data]);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h4 className="font-bold capitalize">{move.move.name}</h4>
        <h4 className="font-semibold">{data?.power}</h4>
      </div>
      <p className="max-h-12 overflow-hidden text-xs leading-tight">{flavorText}</p>
    </div>
  );
}
