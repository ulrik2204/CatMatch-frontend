import { BASE_API_URL, CAT_SUGGESTION_BATCH_SIZE } from "../helpers/constants";
import { toApiCatJudgementsFormat } from "../helpers/utils";
import { type ApiFormatCatJudgements, type CatJudgements } from "../types/catJudgement";

export type FromApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: HeadersInit;
  body?: Record<string, unknown>;
  query?: Record<string, string | number>;
};

/**
 * A facade for the fetch api which throws an error when the response is not ok.
 * @remarks This function assumes the response is json.
 * @param url The url to make a request to.
 * @param options Options for the request.
 * @returns The json data that was returned from the request.
 */
export function fromApi<T extends Record<string, unknown>>(
  url: string,
  options: FromApiOptions = {},
): Promise<T> {
  const urlWithQuery = new URL(url);
  if (options.query) {
    Object.entries(options.query).forEach(([key, value]) => {
      urlWithQuery.searchParams.append(key, value.toString());
    });
  }
  const totalHeaders = new Headers(options.headers);
  if (options.body && !totalHeaders?.get("Content-Type"))
    totalHeaders.set("Content-Type", "application/json");
  return fetch(urlWithQuery, {
    method: options.method,
    headers: totalHeaders,
    body: JSON.stringify(options.body),
  }).then((res) => {
    if (res.ok) return res.json() as unknown as T;
    throw new Error(`Request failed with HTTP status code ${res.status}.`);
  });
}

type GetCatRecommendationsBody = {
  number_of_recommendations: number;
  ratings: ApiFormatCatJudgements;
};

type GetCatRecommendationsResponse = {
  recommendations: string[];
};

export async function getCatRecommendationsFromAPI(
  catJudgements: CatJudgements,
): Promise<string[]> {
  const body: GetCatRecommendationsBody = {
    number_of_recommendations: CAT_SUGGESTION_BATCH_SIZE,
    ratings: toApiCatJudgementsFormat(catJudgements),
  };
  const response = await fromApi<GetCatRecommendationsResponse>(`${BASE_API_URL}/recommendations`, {
    body,
    method: "POST",
  });
  return response.recommendations;
  // const response = await fetch(`${BASE_API_URL}/recommendations`, {
  //   body: JSON.stringify(body),
  //   method: "post",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  // });
  // if (!response.ok)
  //   throw new Error(`Failed to fetch recommendations: ${JSON.stringify(await response.json())}`);
  // return ((await response.json()) as { recommendations: string[] }).recommendations;
}
