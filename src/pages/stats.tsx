import { useCallback, useEffect, useMemo, useState } from "react";
import Button from "../components/Button";
import { useLikedPokemon, useLocalStorage } from "../helpers/hooks";
import crypto from "crypto";
import { Pokemon } from "../types/pokemon";
import { getManyPokemonFromApi } from "../lib/fromApi";
import { log } from "console";

type Statistics = {
  likedPokemonCount: number;
  pokemonTypeDistribution: Record<string, number>;
  mostLikedPokemonType: {
    type: string;
    count: number;
  };
};

function useStatistics() {
  const { likedPokemonNames } = useLikedPokemon();
  const [statistics, setStatistics] = useLocalStorage<Record<string, Statistics> | null>(
    "statistics",
    null,
  );
  const hash = JSON.stringify(likedPokemonNames);
  const isUpdated = statistics != null && hash in statistics;
  const [loading, setLoading] = useState(false);
  const [errorReasons, setErrorReasons] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    console.log("Loading", loading);
  }, [loading]);

  const updateStatistics = useCallback(async () => {
    if (isUpdated) return;
    setLoading(true);
    const [successfulPokemon, rejectedPokemon] = await getManyPokemonFromApi(likedPokemonNames);
    if (rejectedPokemon.length > 0) {
      setErrorReasons(rejectedPokemon);
    }
    const newStatistics = calculateStatistics(successfulPokemon);
    setStatistics({ [hash]: newStatistics });
    console.log("newStatistics", newStatistics);
    setLoading(false);
  }, [statistics, setStatistics, likedPokemonNames, hash]);
  return {
    statistics: statistics == null ? null : statistics[hash],
    isUpdated,
    updateStatistics,
    errorReasons,
    loading,
  };
}

export default function StatsPage() {
  const { statistics, isUpdated, updateStatistics, errorReasons, loading } = useStatistics();
  console.log("stats", statistics);
  return (
    <div className="flex w-full flex-col items-center pt-8">
      <h1>Statistics</h1>
      <div className="pt-8">
        <Button onClick={updateStatistics}>
          {statistics === null ? "Calculate" : "Update"} statistics
        </Button>
      </div>
      {statistics && (
        <div className="w-52">
          <h2>Saved Statistic {isUpdated ? "(current)" : "(not updated)"}</h2>
          <div>
            <pre>{JSON.stringify(statistics, null, 2)}</pre>
          </div>
          {loading && <div>Loading...</div>}
          <div>{errorReasons?.map((reason) => <div>{reason}</div>)}</div>
        </div>
      )}
    </div>
  );
}

function calculateStatistics(pokemons: Pokemon[]): Statistics {
  const pokemonTypeDistribution: Record<string, number> = {};

  for (const pokemon of pokemons) {
    for (const type of pokemon.types) {
      const typeName = type.type.name;
      if (typeName in pokemonTypeDistribution) {
        pokemonTypeDistribution[typeName]++;
      } else {
        pokemonTypeDistribution[typeName] = 1;
      }
    }
  }

  const mostLikedPokemonType = Object.entries(pokemonTypeDistribution).reduce(
    (maxEntry: { type: string; count: number }, [type, count]) => {
      if (count > maxEntry.count) return { type, count };
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
