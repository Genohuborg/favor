"use client";
import { SearchProvider } from "@features/search";
import { isUnreachableError } from "@infra/api";
import { AuthProvider } from "@shared/hooks";
import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type * as React from "react";

function makeQueryClient() {
  // Lazy ref so onError can invalidate the platform-status query that lives
  // on this same client without a circular constructor reference.
  let clientRef: QueryClient | null = null;
  const client = new QueryClient({
    queryCache: new QueryCache({
      onError: (err, query) => {
        if (!isUnreachableError(err)) return;
        if (query.queryKey[0] === "platform-status") return;
        // A real "API unreachable" landed in a query. Force the
        // platform-status poller to refresh so the banner and gated
        // features react within a tick rather than waiting up to 60s.
        clientRef?.invalidateQueries({ queryKey: ["platform-status"] });
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: (failureCount, err) =>
          isUnreachableError(err) ? false : failureCount < 2,
      },
      dehydrate: {
        // include pending queries in dehydration
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
  clientRef = client;
  return client;
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important, so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SearchProvider>
          {children}
          <ReactQueryDevtools />
        </SearchProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
