import {
  CatJudgement,
  type ApiFormatCatJudgements,
  type CatJudgements,
} from "../types/catJudgement";

export function preloadImage(src: string): Promise<HTMLImageElement> {
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
