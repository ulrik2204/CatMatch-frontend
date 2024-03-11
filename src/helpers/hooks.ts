import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { getCatRecommendationsFromAPI, getMostLeastLikedCatsFromAPI } from "../lib/fromApi";
import { type CatJudgement, type CatJudgements } from "../types/catJudgement";
import { CAT_SUGGESTION_BATCH_SIZE, STORAGE_KEYS } from "./constants";
import { preloadImage } from "./utils";

type StorageObject = typeof window.localStorage;
// useStorage, useLocalStorage and useSessionStorage is taken from, but translated to typescript:
// https://github.com/WebDevSimplified/useful-custom-react-hooks/blob/main/src/8-useStorage/useStorage.js

/**
 * Hook to handle operations with localStorage
 * @param key The key of the object in the storageObject
 * @param defaultValue The default value of the item in the storageObject
 * @param storageObject Either localStorage or sessionStorage
 * @returns An array of [value, setValue, remove]
 */
function useStorage<ValueType>(
  key: string,
  defaultValue: ValueType,
  storageObject: StorageObject,
): [ValueType, Dispatch<SetStateAction<ValueType>>] {
  const [value, setValue] = useState<ValueType>(() => {
    const value = storageObject.getItem(key);
    if (value != null) {
      return JSON.parse(value) as ValueType;
    }
    return defaultValue;
  });

  useEffect(() => {
    if (value === undefined) {
      return storageObject.removeItem(key);
    }
    storageObject.setItem(key, JSON.stringify(value));
  }, [key, value, storageObject]);

  return [value, setValue];
}

/**
 * Handling operations with localStorage
 * @param key The key of the object in localStorage
 * @param defaultValue The default value of the item in localStorage.
 * @returns An array of [value, setValue, remove]
 */
export function useLocalStorage<ValueType>(key: string, defaultValue: ValueType) {
  return useStorage(key, defaultValue, window.localStorage);
}

/**
 * Handling operations with sessionStorage
 * @param key The key of the object in sessionStorage
 * @param defaultValue The default value of the item in sessionStorage.
 * @returns An array of [value, setValue, remove]
 */
export function useSessionStorage<ValueType>(key: string, defaultValue: ValueType) {
  return useStorage(key, defaultValue, window.sessionStorage);
}

function usePreloadImages(imageUrls: string[]) {
  useEffect(() => {
    imageUrls.map(preloadImage).forEach((promise) => {
      promise.catch((e) => {
        console.error(`Failed to preload image`, e);
      });
    });
  }, [imageUrls]);
}

type SuggestedCatWithPreloadResult = {
  suggestedCatId: string | null | undefined;
  nextCat: () => void;
};
export function useSuggestedCatWithPreload(
  catJudgements: CatJudgements,
): SuggestedCatWithPreloadResult {
  const [catUrls, setCatUrls] = useState<string[]>([]);
  // Not using isFetching or isLoading as they are unpredictable when enabled: false
  const [isCurrentlyFetching, setIsCurrentlyFetching] = useState<boolean>(false);
  const { data: recommendedCatUrls, refetch } = useQuery(
    ["catRecommendations"],
    () => getCatRecommendationsFromAPI(catJudgements),
    {
      enabled: false,
    },
  );
  usePreloadImages(recommendedCatUrls ?? []);

  useEffect(() => {
    if (catUrls.length < CAT_SUGGESTION_BATCH_SIZE && !isCurrentlyFetching) {
      // console.log("inside if: fetching", isCurrentlyFetching, "catUrls", catUrls.length);
      setIsCurrentlyFetching(true);
      void refetch().then(() => {
        setIsCurrentlyFetching(false);
      });
    }
  }, [refetch, catUrls, isCurrentlyFetching]);

  useEffect(() => {
    if (recommendedCatUrls) {
      setCatUrls((prev) => [...prev, ...recommendedCatUrls.filter((id) => !prev.includes(id))]);
    }
  }, [recommendedCatUrls]);

  const nextCat = useCallback(() => {
    setCatUrls((prev) => prev.slice(1));
  }, []);

  return { suggestedCatId: catUrls[0], nextCat };
}

export function useCatJudgements(): {
  catJudgements: CatJudgements;
  judgeCat: (catId: string, judgement: CatJudgement) => void;
  clearCatJudgements: () => void;
} {
  const [catJudgements, setCatJudgements] = useLocalStorage(STORAGE_KEYS.CAT_JUDGEMENTS, {});

  const judgeCat = useCallback(
    (catId: string, judgement: CatJudgement) => {
      setCatJudgements((prev) => {
        return { ...prev, [catId]: judgement };
      });
    },
    [setCatJudgements],
  );

  const clearCatJudgements = useCallback(() => {
    setCatJudgements({});
  }, [setCatJudgements]);

  return { catJudgements, judgeCat, clearCatJudgements };
}

export function useMostLeastLikedCats(catJudgements: CatJudgements):
  | {
      mostLikedCats: string[];
      leastLikedCats: string[];
    }
  | undefined {
  const { data: mostLeastLikedCats } = useQuery(["mostLeastLikedCats", catJudgements], () =>
    getMostLeastLikedCatsFromAPI(catJudgements),
  );

  return (
    mostLeastLikedCats && {
      mostLikedCats: mostLeastLikedCats.most_liked,
      leastLikedCats: mostLeastLikedCats.least_liked,
    }
  );
}
