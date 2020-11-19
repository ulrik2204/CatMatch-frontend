import { type Pokemon } from "../util/types";

type PokemonCardProps = {
  pokemon: Pokemon;
};
export default function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <div>
      <h1>{pokemon.name}</h1>
      <div>{pokemon.name}</div>
    </div>
  );
}
