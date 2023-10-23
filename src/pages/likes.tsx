import Button from "../components/Button";
import { useLikedPokemon } from "../helpers/hooks";

export default function LikesPage() {
  const { likedPokemonNames, removePokemon } = useLikedPokemon();
  return (
    <div className="flex w-full flex-col items-center pt-8">
      <h1>Liked Pokemon Cards</h1>
      <div className="flex w-full flex-col items-center pt-6">
        {likedPokemonNames.map((pokemonName) => (
          <div
            key={pokemonName}
            className="flex w-5/6 items-center justify-between pt-4 md:w-3/5 lg:w-2/5
          "
          >
            <div className="capitalize">{pokemonName}</div>
            <div className="flex w-40 justify-between md:w-48">
              <a href={`/single/${pokemonName}`}>
                <Button>See card</Button>
              </a>
              <Button color="secondary" onClick={() => removePokemon(pokemonName)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
