import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Text,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useLikedPokemon, useLocalStorage, usePokemonIdCursor } from "../helpers/hooks";
import { getManyPokemonFromApi } from "../lib/fromApi";
import { type Pokemon } from "../types/pokemon";

type DistributionType = Record<string, { type: string; count: number }>;

type Statistics = {
  likedPokemonCount: number;
  likeDislikeRatio: number;
  pokemonTypeDistribution: DistributionType;
  mostLikedPokemonType: {
    type: string;
    count: number;
  };
};

export default function StatsPage() {
  const { statistics, updateStatistics, errorReasons, loading } = useStatistics();

  // To sort the type-like distribution
  const sortedDistribution = useMemo(() => {
    if (statistics === null) return null;
    return Object.values(statistics.pokemonTypeDistribution).sort((a, b) => b.count - a.count);
  }, [statistics]);

  useEffect(() => {
    updateStatistics().catch(console.error);
  }, [updateStatistics]);

  return (
    <div className="flex w-full flex-col items-center pt-8">
      <h1>Statistics</h1>
      <div className="flex h-8 flex-col items-center">
        {loading && <div>Updating...</div>}
        <div>{errorReasons?.map((reason) => <div>{reason}</div>)}</div>
      </div>
      {statistics && sortedDistribution && (
        <div className="flex w-full flex-col items-center pt-4">
          <div className="pt-2">
            <div>Liked pokemon count: {statistics.likedPokemonCount}</div>
            <div>Like-dislike ratio: {(statistics.likeDislikeRatio * 100).toFixed(2)} %</div>
            <div>Most liked type: {statistics.mostLikedPokemonType.type}</div>
          </div>
          <div className="flex w-5/6 flex-col items-center pt-4 md:w-1/2">
            <h2>Number of liked pokemon per type</h2>
            <ResponsiveContainer width="100%" height={1000}>
              <BarChart
                data={sortedDistribution}
                layout="vertical"
                margin={{ top: 16 }}
                className="h-96 w-56"
              >
                <Text />
                <XAxis dataKey="count" type="number" />
                <YAxis dataKey="type" fontSize={14} type="category" />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  fill="#8884d8"
                  activeBar={<Rectangle fill="purple" stroke="blue" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="h-20"></div>
        </div>
      )}
    </div>
  );
}

function calculateStatistics(pokemons: Pokemon[]): Omit<Statistics, "likeDislikeRatio"> {
  const pokemonTypeDistribution: DistributionType = {
    normal: { type: "normal", count: 0 },
    fighting: { type: "fighting", count: 0 },
    flying: { type: "flying", count: 0 },
    poison: { type: "poison", count: 0 },
    ground: { type: "ground", count: 0 },
    rock: { type: "rock", count: 0 },
    bug: { type: "bug", count: 0 },
    ghost: { type: "ghost", count: 0 },
    steel: { type: "steel", count: 0 },
    fire: { type: "fire", count: 0 },
    water: { type: "water", count: 0 },
    grass: { type: "grass", count: 0 },
    electric: { type: "electric", count: 0 },
    psychic: { type: "psychic", count: 0 },
    ice: { type: "ice", count: 0 },
    dragon: { type: "dragon", count: 0 },
    dark: { type: "dark", count: 0 },
    fairy: { type: "fairy", count: 0 },
  };

  for (const pokemon of pokemons) {
    for (const type of pokemon.types) {
      const typeName = type.type.name;
      if (typeName in pokemonTypeDistribution) {
        pokemonTypeDistribution[typeName].count++;
      } else {
        pokemonTypeDistribution[typeName].count = 1;
        console.log("Unknown type", typeName);
      }
    }
  }

  const mostLikedPokemonType = Object.entries(pokemonTypeDistribution).reduce(
    (maxEntry: { type: string; count: number }, [type, obj]) => {
      if (obj.count > maxEntry.count) return { type, count: obj.count };
      return maxEntry;
    },
    { type: "", count: 0 },
  );

  return {
    likedPokemonCount: pokemons.length,
    pokemonTypeDistribution,
    mostLikedPokemonType,
  };
}

function useStatistics() {
  const { likedPokemonNames } = useLikedPokemon();
  const { pokemonIdCursor: numberOfSeenPokemon } = usePokemonIdCursor();
  const [statistics, setStatistics] = useLocalStorage<Record<string, Statistics> | null>(
    "statistics",
    null,
  );
  const hash = JSON.stringify({ likedPokemonNames, numberOfSeenPokemon });
  const isUpdated = statistics != null && hash in statistics;
  const [loading, setLoading] = useState(false);
  const [errorReasons, setErrorReasons] = useState<string[] | undefined>(undefined);

  const updateStatistics = useCallback(async () => {
    if (isUpdated) return;
    setLoading(true);

    const [successfulPokemon, rejectedPokemon] = await getManyPokemonFromApi(likedPokemonNames);
    setErrorReasons(rejectedPokemon.length > 0 ? rejectedPokemon : undefined);

    const newStatistics = calculateStatistics(successfulPokemon);
    const likeDislikeRatio = newStatistics.likedPokemonCount / numberOfSeenPokemon;

    setStatistics({ [hash]: { ...newStatistics, likeDislikeRatio } });
    setLoading(false);
  }, [statistics, setStatistics, likedPokemonNames, isUpdated, hash]);

  return {
    statistics: statistics == null ? null : statistics[Object.keys(statistics)[0]],
    isUpdated,
    updateStatistics,
    errorReasons,
    loading,
  };
}
