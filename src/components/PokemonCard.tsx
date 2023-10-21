import { type PokemonMove } from "../types/move";
import { type Pokemon, type Move } from "../types/pokemon";
import { type ReactElement, useMemo } from "react";

type PokemonCardProps = {
  pokemon: Pokemon;
  move1: PokemonMove;
  move2: PokemonMove | undefined;
};

const pokemonTypeColors = {
  normal: "bg-[#A8A878]",
  fighting: "bg-[#C03028]",
  flying: "bg-[#A890F0]",
  poison: "bg-[#A040A0]",
  ground: "bg-[#E0C068]",
  rock: "bg-[#B8A038]",
  bug: "bg-[#A8B820]",
  ghost: "bg-[#705898]",
  steel: "bg-[#B8B8D0]",
  fire: "bg-[#F08030]",
  water: "bg-[#6890F0]",
  grass: "bg-[#78C850]",
  electric: "bg-[#F8D030]",
  psychic: "bg-[#F85888]",
  ice: "bg-[#98D8D8]",
  dragon: "bg-[#7038F8]",
  dark: "bg-[#705848]",
  fairy: "bg-[#EE99AC]",
};

export default function PokemonCard(props: PokemonCardProps): ReactElement {
  const pokemonType = props.pokemon.types[0].type.name;

  return (
    <div className="flex h-80 w-56 flex-col items-center justify-center rounded border bg-pokeborder p-2">
      <div
        className={`flex h-full w-full flex-col items-center rounded ${
          pokemonTypeColors.hasOwnProperty(pokemonType)
            ? pokemonTypeColors[pokemonType as keyof typeof pokemonTypeColors]
            : "bg-[#68A090]"
        }`}
      >
        <div className="flex w-11/12 flex-col">
          <h2 className="font-bold capitalize">{props.pokemon.name}</h2>
          <div className="flex h-32 w-full flex-col items-center justify-center rounded border-4 border-gray-400 bg-white">
            <img
              src={props.pokemon.sprites.other["official-artwork"].front_default}
              alt="Picture"
              className="h-28 object-contain"
            />
            <div className="flex h-2 w-full items-center justify-center bg-gray-300 text-[0.4rem]">
              {/* Number, height, width */}
              No: {props.pokemon.id} | H: {props.pokemon.height} | W: {props.pokemon.weight}
            </div>
          </div>
          <div>
            <Move move={props.move1} />
            <div className="h-1"></div>
          </div>
          {props.move2 && (
            <div>
              <Move move={props.move2} />
              <div className="h-1"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
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

function Move({ move }: { move: PokemonMove }) {
  // TODO: make this input to PokemonCard instead of doing the request here

  const flavorText = useMemo(() => {
    const moves = move?.flavor_text_entries ?? [];
    const selectedText = moves
      .slice() // To create a copy of the array because .reverse is in-place
      .reverse()
      .find((entry) => entry.language.name === "en");
    if (!selectedText) return "";
    return formatMoveFlavorText(selectedText.flavor_text);
  }, [move]);

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h4 className="font-bold capitalize">{move.name}</h4>
        <h4 className="font-semibold">{move.power}</h4>
      </div>
      <p className="max-h-12 overflow-hidden text-xs leading-tight">{flavorText}</p>
    </div>
  );
}
