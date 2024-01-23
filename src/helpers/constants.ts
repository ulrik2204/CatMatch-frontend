export const BASE_API_URL = import.meta.env.DEV
  ? "http://localhost:8000"
  : "https://catmatch-server.rosby.no";
export const CAT_SUGGESTION_BATCH_SIZE = 15;

export const STORAGE_KEYS = {
  CAT_JUDGEMENTS: "catJudgements",
};
