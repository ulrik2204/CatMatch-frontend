export type FromApiOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Headers;
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

  return fetch(urlWithQuery, {
    method: options.method,
    headers: options.headers,
    body: JSON.stringify(options.body),
  }).then((res) => {
    if (res.ok) return res.json() as unknown as T;
    throw new Error(`Request failed with HTTP status code ${res.status}.`);
  });
}
