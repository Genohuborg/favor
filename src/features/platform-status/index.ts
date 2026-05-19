export { fetchPlatformStatus, probeApiReachable } from "./client";
export {
  ServiceUnavailable,
  ServiceUnavailableDialog,
} from "./components/service-unavailable";
export { StatusBanner } from "./components/status-banner";
export {
  useApiReachable,
  usePlatformStatus,
} from "./hooks/use-platform-status";
export type {
  ActiveIncident,
  Impact,
  PlatformStatus,
  Scope,
  SourceId,
} from "./types";
