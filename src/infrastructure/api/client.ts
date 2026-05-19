import {
  ApiError,
  type AsyncData,
  type FetchOptions,
  UNREACHABLE_CODE,
} from "./types";

const DEFAULT_REVALIDATE = 3600; // 1 hour

const DEFAULT_TIMEOUT = 15_000; // 15 seconds

export async function fetchJson<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const {
    revalidate = DEFAULT_REVALIDATE,
    timeout = DEFAULT_TIMEOUT,
    headers = {},
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    // No credentials here — this runs server-side (SSR/ISR) where Node.js has
    // no cookie jar. Adding credentials: "include" would silently disable the
    // Next.js Data Cache, killing ISR for all public endpoints.
    // Client-side callers (hooks) use their own fetch with credentials.
    const response = await fetch(url, {
      headers: { "Content-Type": "application/json", ...headers },
      signal: controller.signal,
      next: { revalidate },
    });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText, url);
    }

    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError(408, `Request timeout after ${timeout}ms`, url);
    }
    // A network-level failure (DNS, refused, fetch TypeError, undici
    // connection error) reaches here as a generic TypeError on the
    // browser fetch and a Node fetch error server-side. Classify so the
    // platform-status fallback path knows the API is unreachable.
    if (error instanceof TypeError) {
      throw new ApiError(UNREACHABLE_CODE, "API unreachable", url);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function fetchWithState<T>(
  fetcher: () => Promise<T | null>,
): Promise<AsyncData<T>> {
  try {
    const data = await fetcher();
    if (data === null || (Array.isArray(data) && data.length === 0)) {
      return { status: "empty" };
    }
    return { status: "success", data };
  } catch (error) {
    if (error instanceof ApiError) {
      return { status: "error", error: error.message, code: error.code };
    }
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function fetchOrNull<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T | null> {
  try {
    return await fetchJson<T>(url, options);
  } catch (error) {
    if (error instanceof ApiError && error.code === 404) {
      return null;
    }
    console.error(`Fetch error for ${url}:`, error);
    return null;
  }
}
