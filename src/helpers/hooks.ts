import { type Dispatch, type SetStateAction, useCallback, useEffect, useState } from "react";
import { type CatJudgement, type CatJudgements } from "../types/catJudgement";
import { CAT_SUGGESTION_BATCH_SIZE, STORAGE_KEYS } from "./constants";
import { fetchCatIds, preloadImage } from "./utils";

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

export function useLikedCat() {
  const [likedCatNames, setLikedCat] = useLocalStorage<string[]>("likedCat", []);

  const addCat = (catName: string) => {
    if (likedCatNames.includes(catName)) {
      return;
    }
    setLikedCat((prev) => [...prev, catName]);
  };

  const removeCat = (catName: string) => {
    setLikedCat((prev) => prev.filter((name) => name !== catName));
  };

  return { likedCatNames, addCat, removeCat };
}

export function useCatIdCursor() {
  const [catIdCursor, setCatIdCursor] = useLocalStorage<number>("catIdCursor", 1);

  const incrementCatIdCursor = useCallback(() => {
    setCatIdCursor((prev) => prev + 1);
  }, [setCatIdCursor]);
  return { catIdCursor, incrementCatIdCursor };
}

export function useSuggestedCatWithPreload(catJudgements: CatJudgements): {
  suggestedCatId: string | null | undefined;
  nextCat: () => void;
} {
  const [catIds, setCatIds] = useState<string[]>([]);

  useEffect(() => {
    if (catIds.length <= CAT_SUGGESTION_BATCH_SIZE) {
      let cancel = false;
      void fetchCatIds(catJudgements).then((catIds) => {
        if (!cancel) {
          setCatIds((prev) => [...prev, ...catIds.filter((id) => !prev.includes(id))]);
          void catIds.map(preloadImage).map((promise) =>
            promise.catch((e) => {
              console.error(`Failed to preload image`, e);
            }),
          );
        }
      });
      return () => {
        cancel = true;
      };
    }
  }, [catIds.length, catJudgements]);

  const nextCat = useCallback(() => {
    setCatIds((prev) => prev.slice(1));
  }, []);

  return { suggestedCatId: catIds[0], nextCat };
}

export function useCatJudgements(): {
  catJudgements: CatJudgements;
  judgeCat: (catId: string, judgement: CatJudgement) => void;
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

  return { catJudgements, judgeCat };
}
