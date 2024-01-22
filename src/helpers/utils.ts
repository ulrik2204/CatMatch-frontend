import {
  type ApiFormatCatJudgements,
  CatJudgement,
  type CatJudgements,
} from "../types/catJudgement";
import { BASE_API_URL, CAT_SUGGESTION_BATCH_SIZE } from "./constants";

export function preloadImage(src: string) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = function () {
      resolve(img);
    };
    img.onerror = img.onabort = function () {
      reject(src);
    };
    img.src = src;
  });
}

export function toApiCatJudgementsFormat(catJudgements: CatJudgements): ApiFormatCatJudgements {
  return Object.fromEntries(
    Object.entries(catJudgements).map(([catId, judgement]) => {
      switch (judgement) {
        case CatJudgement.LIKE:
          return [catId, true];
        case CatJudgement.DISLIKE:
          return [catId, false];
        case CatJudgement.NOT_JUDGED:
          return [catId, null];
      }
    }),
  );
}

export async function fetchCatIds(catJudgements: CatJudgements): Promise<string[]> {
  interface CatSuggestionOptions {
    number_of_recommendations: number;
    ratings: ApiFormatCatJudgements;
  }

  const suggestionOptions: CatSuggestionOptions = {
    number_of_recommendations: CAT_SUGGESTION_BATCH_SIZE,
    ratings: toApiCatJudgementsFormat(catJudgements),
  };
  const response = await fetch(`${BASE_API_URL}/recommendations`, {
    body: JSON.stringify(suggestionOptions),
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok)
    throw new Error(`Failed to fetch recommendations: ${JSON.stringify(await response.json())}`);
  return ((await response.json()) as { recommendations: string[] }).recommendations;
}
