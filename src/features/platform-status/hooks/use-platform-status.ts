import { useQuery } from "@tanstack/react-query";
import { fetchPlatformStatus } from "../client";
import { CORE_API_UNREACHABLE_ID } from "../sources/self";

const REFETCH_MS = 60_000;

export function usePlatformStatus() {
  return useQuery({
    queryKey: ["platform-status"],
    queryFn: ({ signal }) => fetchPlatformStatus(signal),
    staleTime: REFETCH_MS,
    refetchInterval: REFETCH_MS,
    refetchOnWindowFocus: true,
    retry: 1,
  });
}

export function useApiReachable(): boolean {
  const { data } = usePlatformStatus();
  if (!data) return true;
  return !data.incidents.some(
    (i) => i.id === CORE_API_UNREACHABLE_ID && i.impact === "major",
  );
}
