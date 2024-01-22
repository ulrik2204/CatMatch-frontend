export type CatJudgements = Record<string, CatJudgement>;

export enum CatJudgement {
  LIKE = 1,
  DISLIKE = -1,
  NOT_JUDGED = 0,
}

export type ApiFormatCatJudgements = Record<string, boolean | null>;
