"use client";

import { useApiReachable } from "@features/platform-status";
import {
  Combobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { cn } from "@infra/utils";
import { ArrowRight, Loader2, MapPin, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type FormEvent,
  useCallback,
  useDeferredValue,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useSearch } from "../context/search-context";
import { usePivotExpansion } from "../hooks/use-pivot-expansion";
import { useSearchHistory } from "../hooks/use-search-history";
import { useTypeahead } from "../hooks/use-typeahead";
import type { EntityType, TypeaheadSuggestion } from "../types/api";
import type { HistoryItem } from "../types/history";
import {
  isRoutableQuery,
  navigateToQuery,
  parseQuery,
  preloadVariantDebounced,
} from "../utils";
import {
  ENTITY_TYPES_WITH_PAGES,
  getEntityUrl,
  hasEntityPage,
} from "../utils/entity-routes";
import { SearchHistoryPanel } from "./search-history-panel";

type GenomeBuild = "hg38" | "hg19";

// State machine for search modes
// typing: user is typing, show typeahead suggestions
// selected: user has selected an anchor, show pivot results
type SearchMode = "idle" | "typing" | "selected";

interface SearchState {
  mode: SearchMode;
  query: string;
  anchors: TypeaheadSuggestion[];
}

const ENTITY_CONFIG: Record<
  EntityType,
  {
    label: string;
    textColor: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  genes: {
    label: "GENES",
    textColor: "text-purple-700",
    bgColor: "bg-purple-600",
    borderColor: "border-purple-200",
  },
  variants: {
    label: "VARIANTS",
    textColor: "text-blue-700",
    bgColor: "bg-blue-600",
    borderColor: "border-blue-200",
  },
  diseases: {
    label: "DISEASES",
    textColor: "text-red-700",
    bgColor: "bg-red-600",
    borderColor: "border-red-200",
  },
  drugs: {
    label: "DRUGS",
    textColor: "text-green-700",
    bgColor: "bg-green-600",
    borderColor: "border-green-200",
  },
  pathways: {
    label: "PATHWAYS",
    textColor: "text-orange-700",
    bgColor: "bg-orange-600",
    borderColor: "border-orange-200",
  },
  phenotypes: {
    label: "PHENOTYPES",
    textColor: "text-pink-700",
    bgColor: "bg-pink-600",
    borderColor: "border-pink-200",
  },
  studies: {
    label: "STUDIES",
    textColor: "text-cyan-700",
    bgColor: "bg-cyan-600",
    borderColor: "border-cyan-200",
  },
  entities: {
    label: "ENTITIES",
    textColor: "text-amber-700",
    bgColor: "bg-amber-600",
    borderColor: "border-amber-200",
  },
  go_terms: {
    label: "GO TERMS",
    textColor: "text-emerald-700",
    bgColor: "bg-emerald-600",
    borderColor: "border-emerald-200",
  },
  side_effects: {
    label: "SIDE EFFECTS",
    textColor: "text-yellow-700",
    bgColor: "bg-yellow-600",
    borderColor: "border-yellow-200",
  },
  ccre: {
    label: "CANDIDATE CIS-REGULATORY ELEMENTS",
    textColor: "text-teal-700",
    bgColor: "bg-teal-600",
    borderColor: "border-teal-200",
  },
  metabolites: {
    label: "METABOLITES",
    textColor: "text-rose-700",
    bgColor: "bg-rose-600",
    borderColor: "border-rose-200",
  },
  signals: {
    label: "SIGNALS",
    textColor: "text-indigo-700",
    bgColor: "bg-indigo-600",
    borderColor: "border-indigo-200",
  },
  protein_domains: {
    label: "DOMAINS",
    textColor: "text-violet-700",
    bgColor: "bg-violet-600",
    borderColor: "border-violet-200",
  },
  tissues: {
    label: "TISSUES",
    textColor: "text-lime-700",
    bgColor: "bg-lime-600",
    borderColor: "border-lime-200",
  },
  cell_types: {
    label: "CELL TYPES",
    textColor: "text-sky-700",
    bgColor: "bg-sky-600",
    borderColor: "border-sky-200",
  },
};

const FALLBACK_ENTITY_CONFIG = {
  label: "OTHER",
  textColor: "text-foreground",
  bgColor: "bg-muted-foreground",
  borderColor: "border-border",
};

const EXAMPLE_QUERIES = [
  "BRCA1",
  "rs7412",
  "Alzheimer disease",
  "Metformin",
  "19-44808820-44908922",
] as const;

function getEntityConfig(type: EntityType) {
  return ENTITY_CONFIG[type] ?? FALLBACK_ENTITY_CONFIG;
}

/** Readable labels for link keys returned by the API */
const LINK_LABELS: Record<string, string> = {
  genes: "genes",
  variants: "variants",
  diseases: "diseases",
  drugs: "drugs",
  pathways: "pathways",
  phenotypes: "phenotypes",
  studies: "studies",
  entities: "entities",
  go_terms: "GO terms",
  side_effects: "side effects",
  ccre: "cCREs",
  metabolites: "metabolites",
  signals: "signals",
  protein_domains: "domains",
  tissues: "tissues",
  cell_types: "cell types",
  domains: "domains",
  l2g_variants: "L2G variants",
  disposition_drugs: "disp. drugs",
  disposition_genes: "disp. genes",
  paralogs: "paralogs",
  drug_pairs: "drug pairs",
  pgx_variants: "PGx variants",
  pgx_genes: "PGx genes",
  pair_side_effects: "pair side effects",
  traits: "traits",
};

/** Build sorted link counts from dynamic links object, excluding the entity's own type */
function buildLinkCounts(
  links: Record<string, number> | undefined,
  excludeType?: string,
): Array<{ label: string; count: number }> {
  if (!links) return [];
  return Object.entries(links)
    .filter(([key, count]) => key !== excludeType && count > 0)
    .map(([key, count]) => ({
      label: LINK_LABELS[key] ?? key.replace(/_/g, " "),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

// AnchorChip Component - displays selected anchor as a chip inside the input
// Styled to match HG38/HG19 toggle height and aesthetic
function AnchorChip({
  anchor,
  onRemove,
}: {
  anchor: TypeaheadSuggestion;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 bg-muted rounded-xl pl-4 pr-2 py-2">
      <span className="text-sm font-semibold text-foreground">
        {anchor.display_name}
      </span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </span>
  );
}

export function UniversalSearch() {
  const router = useRouter();
  const { isOpen: ctxIsOpen, initialQuery, closeSearch } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const [genome, setGenome] = useState<GenomeBuild>("hg38");
  const [searchState, setSearchState] = useState<SearchState>({
    mode: "idle",
    query: "",
    anchors: [],
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [_highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const apiReachable = useApiReachable();

  // Derive query from state
  const query = searchState.query;
  const deferredQuery = useDeferredValue(query);

  // Typeahead hook - only active in typing mode
  const {
    setQuery: setTypeaheadQuery,
    results: typeaheadResults,
    isLoading: isTypeaheadLoading,
    clear: clearTypeahead,
    refetch: refetchTypeahead,
  } = useTypeahead({
    minLength: 2,
    debounce: 300,
    limit: 5, // Request 5 so after best match deduplication, we still show 4
    includeLinks: true,
    types: ENTITY_TYPES_WITH_PAGES, // Only search entity types with dedicated pages
  });

  // Pivot expansion hook - only active in selected mode
  const {
    setAnchor: setPivotAnchor,
    results: pivotResults,
    isLoading: isPivotLoading,
    error: pivotError,
    clear: clearPivot,
    expandedTypes,
    expandingType,
    fetchMoreForType,
  } = usePivotExpansion({
    types: ENTITY_TYPES_WITH_PAGES,
    limit: 5,
    expandedLimit: 50,
  });

  // Search history — drives the empty-state Recent panel and records commits
  const { record: recordHistory } = useSearchHistory({
    kind: "search",
    limit: 10,
  });

  // ⌘K (and any other openSearch caller) → focus this input + show history.
  // The provider holds open/closed state; we just react to it locally.
  useEffect(() => {
    if (ctxIsOpen) {
      if (initialQuery) {
        setSearchState({ mode: "typing", query: initialQuery, anchors: [] });
      }
      setIsDropdownOpen(true);
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      setIsDropdownOpen(false);
    }
  }, [ctxIsOpen, initialQuery]);

  // Reset the provider flag if this component unmounts while it was open
  // (e.g. user pressed ⌘K once on / then navigated away). Otherwise the
  // flag stays true and the next mount of UniversalSearch would auto-open.
  useEffect(
    () => () => {
      closeSearch();
    },
    [closeSearch],
  );

  // Is the current query a direct-routable region like "1-10001-20002"?
  const parsedQuery = parseQuery(query);
  const isRegionQuery = parsedQuery.type === "region" && parsedQuery.isValid;

  // Sync typeahead query only when in typing mode — skip for regions (not searchable)
  useEffect(() => {
    if (searchState.mode === "typing" && !isRegionQuery) {
      setTypeaheadQuery(deferredQuery);
    } else if (isRegionQuery) {
      clearTypeahead();
    }
  }, [
    deferredQuery,
    searchState.mode,
    setTypeaheadQuery,
    isRegionQuery,
    clearTypeahead,
  ]);

  // Sync pivot anchor when in selected mode (use last anchor for pivot queries)
  useEffect(() => {
    const lastAnchor = searchState.anchors[searchState.anchors.length - 1];
    if (searchState.mode === "selected" && lastAnchor) {
      setPivotAnchor({
        id: lastAnchor.id,
        type: lastAnchor.entity_type,
      });
    } else if (searchState.mode !== "selected") {
      clearPivot();
    }
  }, [searchState.mode, searchState.anchors, setPivotAnchor, clearPivot]);

  const handleInputChange = useCallback(
    (value: string) => {
      setSearchState((prev) => {
        if (value.trim().length === 0 && prev.anchors.length === 0) {
          return { mode: "idle", query: "", anchors: [] };
        } else if (value.trim().length === 0 && prev.anchors.length > 0) {
          // Keep anchors, stay in selected mode with empty query
          return { mode: "selected", query: "", anchors: prev.anchors };
        } else if (prev.anchors.length > 0) {
          // Has anchors - stay in selected mode while typing to filter
          return { mode: "selected", query: value, anchors: prev.anchors };
        } else {
          // No anchors - typing mode
          return { mode: "typing", query: value, anchors: [] };
        }
      });

      if (value.trim().length >= 2 || searchState.anchors.length > 0) {
        setIsDropdownOpen(true);
      } else if (
        value.trim().length === 0 &&
        searchState.anchors.length === 0
      ) {
        setIsDropdownOpen(false);
      }
      setHighlightedIndex(-1);
    },
    [searchState.anchors.length],
  );

  // Preload variant data when user types a complete VCF (only in typing mode, not for regions)
  useEffect(() => {
    if (searchState.mode !== "typing" || isRegionQuery) return;

    const parsed = parseQuery(query);
    if (
      parsed.isValid &&
      (parsed.type === "variant_vcf" || parsed.type === "variant_rsid")
    ) {
      preloadVariantDebounced(query, 500).catch(() => {
        // Silently fail - preloading is optional optimization
      });
    }
  }, [query, searchState.mode, isRegionQuery]);

  const _handleGenomeChange = useCallback((value: GenomeBuild) => {
    setGenome(value);
  }, []);

  const handleSelectSuggestion = useCallback(
    (suggestion: TypeaheadSuggestion) => {
      // Always anchor for pivot exploration (click path)
      startTransition(() => {
        setSearchState((prev) => ({
          mode: "selected",
          query: "",
          anchors: [...prev.anchors, suggestion],
        }));
        setHighlightedIndex(-1);
      });
    },
    [],
  );

  const handleRemoveAnchorAt = useCallback(
    (index: number) => {
      startTransition(() => {
        // Clear pivot results immediately to prevent stale data flash
        clearPivot();

        setSearchState((prev) => {
          const newAnchors = prev.anchors.slice(0, index);
          const newMode =
            newAnchors.length > 0
              ? "selected"
              : prev.query.trim().length >= 2
                ? "typing"
                : "idle";
          return {
            mode: newMode,
            query: prev.query,
            anchors: newAnchors,
          };
        });

        // Force re-fetch typeahead since query didn't change
        // (setTypeaheadQuery won't trigger fetch if query is same)
        refetchTypeahead();
      });
    },
    [clearPivot, refetchTypeahead],
  );

  // Handle clicking a pivot result - can navigate or pivot-hop
  const handlePivotItemClick = useCallback(
    (item: TypeaheadSuggestion) => {
      if (hasEntityPage(item.entity_type)) {
        // Navigate to entity page - always use getEntityUrl for consistent routing
        const url = getEntityUrl(item.entity_type, item.id, { genome });
        router.push(url);
        clearTypeahead();
        clearPivot();
        setSearchState({ mode: "idle", query: "", anchors: [] });
        setIsDropdownOpen(false);
      } else {
        // Pivot-hop: add this as new anchor
        handleSelectSuggestion(item);
      }
    },
    [genome, router, clearTypeahead, clearPivot, handleSelectSuggestion],
  );

  // Navigate to last anchor entity page (used in selected mode)
  const navigateToAnchor = useCallback(async () => {
    const lastAnchor = searchState.anchors[searchState.anchors.length - 1];
    if (searchState.mode !== "selected" || !lastAnchor) return false;

    if (!hasEntityPage(lastAnchor.entity_type)) {
      // No entity page - stay in pivot view
      return false;
    }

    // For variants, try routing via rsID if available
    if (lastAnchor.entity_type === "variants") {
      // Check if display_name is an rsID
      const rsIdMatch = lastAnchor.display_name.match(/^rs\d+$/i);
      if (rsIdMatch) {
        const success = await navigateToQuery(
          lastAnchor.display_name,
          genome,
          router,
        );
        if (success) {
          recordHistory({
            kind: "search",
            query: lastAnchor.display_name,
            entityType: lastAnchor.entity_type,
            entityId: lastAnchor.id,
            entityLabel: lastAnchor.display_name,
            genome,
          });
          clearTypeahead();
          clearPivot();
          setSearchState({ mode: "idle", query: "", anchors: [] });
          setIsDropdownOpen(false);
          return true;
        }
      }
    }

    // Standard URL navigation using anchor.id (not display_name) - always use getEntityUrl for consistent routing
    const url = getEntityUrl(lastAnchor.entity_type, lastAnchor.id, { genome });
    router.push(url);
    recordHistory({
      kind: "search",
      query: lastAnchor.display_name,
      entityType: lastAnchor.entity_type,
      entityId: lastAnchor.id,
      entityLabel: lastAnchor.display_name,
      genome,
    });
    clearTypeahead();
    clearPivot();
    setSearchState({ mode: "idle", query: "", anchors: [] });
    setIsDropdownOpen(false);
    return true;
  }, [searchState, genome, router, clearTypeahead, clearPivot, recordHistory]);

  /** Navigate directly to the best suggestion's entity page */
  const navigateToSuggestion = useCallback(
    (suggestion: TypeaheadSuggestion) => {
      const url = getEntityUrl(suggestion.entity_type, suggestion.id, {
        genome,
      });
      router.push(url);
      recordHistory({
        kind: "search",
        query: query || suggestion.display_name,
        entityType: suggestion.entity_type,
        entityId: suggestion.id,
        entityLabel: suggestion.display_name,
        genome,
      });
      clearTypeahead();
      clearPivot();
      setSearchState({ mode: "idle", query: "", anchors: [] });
      setIsDropdownOpen(false);
    },
    [genome, query, router, clearTypeahead, clearPivot, recordHistory],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      if (searchState.mode === "idle") return;

      // Selected mode: Enter navigates to anchor entity page (if available)
      if (searchState.mode === "selected") {
        await navigateToAnchor();
        return;
      }

      // Typing mode: try direct routing for VCF/rsID first
      if (isRoutableQuery(query)) {
        const success = await navigateToQuery(query, genome, router);
        if (success) {
          recordHistory({ kind: "search", query, genome });
          clearTypeahead();
          setSearchState({ mode: "idle", query: "", anchors: [] });
          setIsDropdownOpen(false);
          return;
        }
      }

      // Enter navigates to best suggestion if it has a page
      if (typeaheadResults && typeaheadResults.total_count > 0) {
        for (const group of typeaheadResults.groups) {
          if (group.suggestions.length > 0) {
            const best = group.suggestions[0];
            if (hasEntityPage(best.entity_type)) {
              navigateToSuggestion(best);
              return;
            }
            // No entity page → anchor for pivot
            handleSelectSuggestion(best);
            return;
          }
        }
      }

      // No suggestions - do nothing
    },
    [
      searchState,
      typeaheadResults,
      genome,
      router,
      clearTypeahead,
      handleSelectSuggestion,
      navigateToSuggestion,
      query,
      navigateToAnchor,
      recordHistory,
    ],
  );

  // History panel handlers — used in idle mode when the dropdown is open
  const handlePickHistoryItem = useCallback(
    (it: HistoryItem, options?: { openInNewTab?: boolean }) => {
      const eType = it.entityType as EntityType | undefined;
      if (eType && it.entityId && hasEntityPage(eType)) {
        const url = getEntityUrl(eType, it.entityId, { genome });
        if (options?.openInNewTab) {
          window.open(url, "_blank", "noopener,noreferrer");
        } else {
          router.push(url);
          setIsDropdownOpen(false);
        }
        recordHistory({
          kind: "search",
          query: it.query ?? it.entityLabel ?? "",
          entityType: it.entityType,
          entityId: it.entityId,
          entityLabel: it.entityLabel,
          genome,
        });
        return;
      }
      // Free-text — drop into the input and let typeahead take over
      if (it.query) {
        setSearchState({ mode: "typing", query: it.query, anchors: [] });
        setIsDropdownOpen(true);
      }
    },
    [genome, router, recordHistory],
  );

  const handlePickSuggestedQuery = useCallback((q: string) => {
    setSearchState({ mode: "typing", query: q, anchors: [] });
    setIsDropdownOpen(true);
  }, []);

  // Click-outside detection
  const isDropdownOpenRef = useRef(isDropdownOpen);
  isDropdownOpenRef.current = isDropdownOpen;

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isDropdownOpenRef.current
      ) {
        setIsDropdownOpen(false);
        closeSearch();
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [isDropdownOpen, closeSearch]);

  const handleFocus = () => {
    // Always open: in idle we show history; in typing/selected we show results
    setIsDropdownOpen(true);
  };

  // Build flat list of typeahead suggestions for keyboard navigation
  const flatTypeaheadSuggestions: TypeaheadSuggestion[] = [];
  if (searchState.mode === "typing" && typeaheadResults) {
    for (const group of typeaheadResults.groups) {
      flatTypeaheadSuggestions.push(...group.suggestions);
    }
  }

  // Build grouped suggestions for display (no reordering - trust backend)
  const groupedTypeaheadSuggestions: Array<{
    type: EntityType;
    items: TypeaheadSuggestion[];
  }> = [];

  // Best match is the first item from the first group (trust backend ordering)
  let bestMatch: TypeaheadSuggestion | null = null;

  if (typeaheadResults && typeaheadResults.total_count > 0) {
    for (const group of typeaheadResults.groups) {
      if (group.suggestions.length > 0) {
        // First suggestion of first group is best match
        if (!bestMatch) {
          bestMatch = group.suggestions[0];
        }

        // Filter out best match from its group to avoid duplication
        const filteredItems =
          bestMatch && group.entity_type === bestMatch.entity_type
            ? group.suggestions.filter((item) => item.id !== bestMatch?.id)
            : group.suggestions;

        // Limit to 4 items max for consistent display
        const limitedItems = filteredItems.slice(0, 4);

        // Only add group if it has items after filtering
        if (limitedItems.length > 0) {
          groupedTypeaheadSuggestions.push({
            type: group.entity_type,
            items: limitedItems,
          });
        }
      }
    }
  }

  // Build pivot groups for display (trust backend ordering)
  // Pivot API returns same format as typeahead: groups with suggestions
  const pivotGroups: Array<{
    type: EntityType;
    items: TypeaheadSuggestion[];
  }> = [];

  if (pivotResults && pivotResults.total_count > 0) {
    for (const group of pivotResults.groups) {
      if (group.suggestions.length > 0) {
        pivotGroups.push({
          type: group.entity_type,
          items: group.suggestions,
        });
      }
    }
  }

  const isLoading =
    searchState.mode === "typing" ? isTypeaheadLoading : isPivotLoading;

  return (
    <div className="w-full" ref={containerRef}>
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-linear-to-r from-purple-200 to-indigo-200 rounded-[28px] blur-xl opacity-40 group-hover:opacity-60 transition duration-500"></div>

        <div className="relative">
          <Combobox value={null} onChange={() => {}}>
            <div className="relative flex flex-col sm:flex-row items-center bg-card p-2.5 rounded-3xl shadow-2xl shadow-border/50 border border-card/80 ring-1 ring-border">
              <div className="bg-muted rounded-2xl p-1 m-1 sm:mr-4 shrink-0">
                <div className="px-4 py-3 rounded-xl text-sm font-semibold text-foreground bg-background shadow-sm">
                  GRCh38
                </div>
              </div>

              <div className="flex-1 w-full relative flex items-center gap-2 flex-wrap px-2 py-1.5 min-h-14">
                {/* Anchor chips */}
                {searchState.anchors.map((anchor, index) => (
                  <AnchorChip
                    key={anchor.id}
                    anchor={anchor}
                    onRemove={() => handleRemoveAnchorAt(index)}
                  />
                ))}

                {/* Text input */}
                <ComboboxInput
                  ref={inputRef}
                  className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-foreground placeholder-muted-foreground/50 text-lg py-2 font-medium tracking-tight focus:outline-none"
                  displayValue={() => query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onFocus={handleFocus}
                  onKeyDown={(e) => {
                    // Backspace on empty input removes last anchor
                    if (
                      e.key === "Backspace" &&
                      query === "" &&
                      searchState.anchors.length > 0
                    ) {
                      e.preventDefault();
                      handleRemoveAnchorAt(searchState.anchors.length - 1);
                      return;
                    }

                    if (e.key === "Enter") {
                      // Always handle Enter ourselves — never let Combobox anchor
                      // Click = explore (pivot), Enter = go (navigate)
                      e.preventDefault();
                      handleSubmit(e as unknown as FormEvent);
                      return;
                    }

                    if (e.key === "Escape") {
                      e.preventDefault();
                      setIsDropdownOpen(false);
                      closeSearch();
                      inputRef.current?.blur();
                    }
                  }}
                  placeholder={
                    searchState.anchors.length > 0
                      ? "Continue searching..."
                      : "Search genes, variants, diseases, drugs, pathways..."
                  }
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>

              <button
                type="submit"
                className="hidden sm:flex bg-primary hover:bg-primary/90 text-white w-12 h-12 rounded-[18px] transition-all duration-200 items-center justify-center shadow-lg shadow-foreground/10 mr-1"
              >
                {(isLoading || isPending) && isDropdownOpen ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <Search className="w-6 h-6" />
                )}
              </button>
            </div>

            {/* Dropdown */}
            {isDropdownOpen && (
              <ComboboxOptions
                static
                className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl bg-card border border-border shadow-2xl focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200"
                style={{ maxHeight: "calc(100vh - 400px)" }}
              >
                {/* Loading bar */}
                {(isLoading || isPending) && (
                  <div className="h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 animate-pulse" />
                )}

                <div
                  className="overflow-y-auto"
                  style={{ maxHeight: "calc(100vh - 400px)" }}
                >
                  {!apiReachable ? (
                    <div className="px-6 py-12 text-center">
                      <p className="text-sm font-medium text-foreground">
                        Search unavailable
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        FAVOR API is unreachable.
                      </p>
                    </div>
                  ) : null}
                  {/* TYPING MODE: Show typeahead suggestions */}
                  {apiReachable && searchState.mode === "typing" && (
                    <>
                      {/* Region query — show direct navigation prompt, skip typeahead */}
                      {isRegionQuery ? (
                        <button
                          type="button"
                          onClick={() =>
                            handleSubmit(
                              new Event("submit") as unknown as FormEvent,
                            )
                          }
                          className="w-full text-left px-5 py-5 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                              <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground">
                                Navigate to region
                              </div>
                              <div className="text-sm text-muted-foreground font-mono">
                                {parsedQuery.normalized}
                              </div>
                            </div>
                            <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono text-xs text-muted-foreground">
                              Enter
                            </kbd>
                          </div>
                        </button>
                      ) : isTypeaheadLoading &&
                        groupedTypeaheadSuggestions.length === 0 ? (
                        <div className="py-8 px-6 text-center text-muted-foreground">
                          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                          <div className="text-sm">Searching...</div>
                        </div>
                      ) : groupedTypeaheadSuggestions.length === 0 &&
                        !bestMatch &&
                        query.trim() !== "" ? (
                        <div className="py-8 px-6 text-center text-muted-foreground">
                          <div className="text-sm">No results found</div>
                        </div>
                      ) : (
                        <>
                          {/* Best Match Card */}
                          {bestMatch && (
                            <BestMatchCard
                              item={bestMatch}
                              onSelect={handleSelectSuggestion}
                            />
                          )}

                          {/* Grouped Results */}
                          {groupedTypeaheadSuggestions.map((group) => (
                            <TypeaheadGroupSection
                              key={group.type}
                              group={group}
                              onSelect={handleSelectSuggestion}
                            />
                          ))}
                        </>
                      )}
                    </>
                  )}

                  {/* SELECTED MODE: Show pivot results (anchor chips are in input) */}
                  {apiReachable &&
                    searchState.mode === "selected" &&
                    searchState.anchors.length > 0 && (
                      <>
                        {/* Pivot Anchor Info Card */}
                        <PivotAnchorCard
                          anchor={
                            searchState.anchors[searchState.anchors.length - 1]
                          }
                        />

                        {/* Pivot Results Section */}
                        {isPivotLoading ? (
                          // Loading skeleton while pivot fetches
                          <div className="py-8 px-6 text-center text-muted-foreground">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                            <div className="text-sm">
                              Loading related entities...
                            </div>
                          </div>
                        ) : pivotError ? (
                          // Error state - show message without collapsing
                          <div className="py-8 px-6 text-center text-red-400">
                            <div className="text-sm">
                              Failed to load related entities
                            </div>
                            <div className="text-xs mt-1 text-muted-foreground">
                              {pivotError.message}
                            </div>
                          </div>
                        ) : pivotGroups.length === 0 ? (
                          // No results
                          <div className="py-8 px-6 text-center text-muted-foreground">
                            <div className="text-sm">
                              No related entities found
                            </div>
                          </div>
                        ) : (
                          // Pivot context header + groups
                          <>
                            {/* Related to header */}
                            <div className="px-5 py-3 bg-muted/80 border-b border-border">
                              <span className="text-sm text-muted-foreground">
                                Related to{" "}
                                <span
                                  className={cn(
                                    "font-semibold",
                                    getEntityConfig(
                                      searchState.anchors[
                                        searchState.anchors.length - 1
                                      ].entity_type,
                                    ).textColor,
                                  )}
                                >
                                  {
                                    searchState.anchors[
                                      searchState.anchors.length - 1
                                    ].display_name
                                  }
                                </span>
                              </span>
                            </div>
                            {pivotGroups.map((group) => {
                              const lastAnchor =
                                searchState.anchors[
                                  searchState.anchors.length - 1
                                ];
                              const totalAvailable =
                                lastAnchor.links?.[group.type] ??
                                group.items.length;
                              return (
                                <PivotGroupSection
                                  key={group.type}
                                  group={group}
                                  onItemClick={handlePivotItemClick}
                                  totalAvailable={totalAvailable}
                                  isExpanded={expandedTypes.has(group.type)}
                                  isExpanding={expandingType === group.type}
                                  onShowMore={() =>
                                    fetchMoreForType(group.type)
                                  }
                                />
                              );
                            })}
                          </>
                        )}
                      </>
                    )}

                  {/* IDLE MODE: Show recent searches (or empty-state suggestions) */}
                  {apiReachable && searchState.mode === "idle" && (
                    <SearchHistoryPanel
                      onPickItem={handlePickHistoryItem}
                      onPickSuggestedQuery={handlePickSuggestedQuery}
                      suggestions={EXAMPLE_QUERIES}
                    />
                  )}
                </div>

                {/* Hint bar — show when there are results */}
                {apiReachable &&
                  searchState.mode === "typing" &&
                  (bestMatch || groupedTypeaheadSuggestions.length > 0) && (
                    <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-border bg-muted/50 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">
                          ↵
                        </kbd>
                        go to page
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">
                          click
                        </kbd>
                        explore connections
                      </span>
                    </div>
                  )}

                {/* Hint bar — idle mode */}
                {apiReachable && searchState.mode === "idle" && (
                  <div className="flex items-center justify-end gap-4 px-4 py-2 border-t border-border bg-muted/50 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">
                        ↑↓
                      </kbd>
                      navigate
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">
                        ↵
                      </kbd>
                      open
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <kbd className="px-1.5 py-0.5 rounded bg-background border border-border font-mono text-[10px]">
                        ⌫
                      </kbd>
                      remove
                    </span>
                  </div>
                )}
              </ComboboxOptions>
            )}
          </Combobox>
        </div>
      </form>

      {/* Helper Text */}
      <div className="mt-6 flex justify-center gap-8 text-sm font-medium text-muted-foreground uppercase tracking-widest opacity-80 flex-wrap">
        {EXAMPLE_QUERIES.map((search) => (
          <button
            type="button"
            key={search}
            className="hover:text-purple-600 cursor-pointer transition-colors"
            onClick={() => {
              startTransition(() => {
                setSearchState({ mode: "typing", query: search, anchors: [] });
                setIsDropdownOpen(true);
              });
            }}
          >
            {search}
          </button>
        ))}
      </div>
    </div>
  );
}

// Pivot Anchor Card - shows info about the current pivot anchor at the top of dropdown
function PivotAnchorCard({ anchor }: { anchor: TypeaheadSuggestion }) {
  const config = getEntityConfig(anchor.entity_type);

  // Truncate description
  const truncatedDescription = anchor.description
    ? anchor.description.length > 120
      ? `${anchor.description.slice(0, 120).trim()}...`
      : anchor.description
    : null;

  const linkCounts = buildLinkCounts(anchor.links);

  return (
    <div className="px-5 py-5 border-b border-border bg-gradient-to-br from-muted/80 to-card">
      {/* Entity name and type badge */}
      <div className="flex items-center gap-3 mb-2">
        <h3
          className={cn("text-xl font-bold tracking-tight", config.textColor)}
        >
          {anchor.display_name}
        </h3>
        <span
          className={cn(
            "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider text-white shadow-sm",
            config.bgColor,
          )}
        >
          {config.label}
        </span>
      </div>

      {/* Description */}
      {truncatedDescription && (
        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {truncatedDescription}
        </p>
      )}

      {/* Link counts - show all available */}
      {linkCounts.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {linkCounts.map((link) => (
            <span
              key={link.label}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-muted rounded-lg text-xs"
            >
              <span className="font-semibold text-foreground">
                {link.count.toLocaleString()}
              </span>
              <span className="text-muted-foreground">{link.label}</span>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Best Match Card Component (for typing mode)
function BestMatchCard({
  item,
  onSelect,
}: {
  item: TypeaheadSuggestion;
  onSelect: (item: TypeaheadSuggestion) => void;
}) {
  const config = getEntityConfig(item.entity_type);
  const linkCounts = buildLinkCounts(item.links, item.entity_type);

  // Truncate description
  const truncatedDescription = item.description
    ? item.description.length > 120
      ? `${item.description.slice(0, 120).trim()}...`
      : item.description
    : null;

  return (
    <ComboboxOption
      as="div"
      value={item}
      onClick={() => onSelect(item)}
      className="cursor-pointer transition-colors duration-150 data-[focus]:bg-muted"
    >
      <div className="border-b border-border px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {/* Name and type */}
            <div className="flex items-center gap-2 mb-2">
              <h3 className={cn("font-bold text-base", config.textColor)}>
                {item.display_name}
              </h3>
              <span
                className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase text-white/90",
                  config.bgColor,
                )}
              >
                {config.label}
              </span>
            </div>

            {/* Description */}
            {truncatedDescription && (
              <p className="text-sm text-foreground leading-relaxed mb-3">
                {truncatedDescription}
              </p>
            )}

            {/* Link counts */}
            {linkCounts.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
                {linkCounts.map((link) => (
                  <span
                    key={link.label}
                    className="inline-flex items-center gap-1"
                  >
                    <span className="font-semibold text-muted-foreground">
                      {link.count.toLocaleString()}
                    </span>
                    <span className="text-muted-foreground">{link.label}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Arrow indicator */}
          <div className="text-muted-foreground pt-1">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </ComboboxOption>
  );
}

// Typeahead Group Section Component
function TypeaheadGroupSection({
  group,
  onSelect,
}: {
  group: { type: EntityType; items: TypeaheadSuggestion[] };
  onSelect: (item: TypeaheadSuggestion) => void;
}) {
  const config = getEntityConfig(group.type);

  return (
    <div className="border-b border-border last:border-0">
      {/* Section Header - Colored */}
      <div
        className={cn(
          "sticky top-0 z-10 px-4 py-2 flex items-center gap-2",
          config.bgColor,
        )}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-white">
          {config.label}
        </span>
        <span className="text-xs text-white/70">({group.items.length})</span>
      </div>

      {/* Entity Cards - Two Column Grid on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {group.items.map((item) => (
          <SuggestionCard
            key={item.id}
            item={item}
            config={config}
            onClick={() => onSelect(item)}
          />
        ))}
      </div>
    </div>
  );
}

// Pivot Group Section Component
function PivotGroupSection({
  group,
  onItemClick,
  totalAvailable,
  isExpanded,
  isExpanding,
  onShowMore,
}: {
  group: { type: EntityType; items: TypeaheadSuggestion[] };
  onItemClick: (item: TypeaheadSuggestion) => void;
  totalAvailable: number;
  isExpanded: boolean;
  isExpanding: boolean;
  onShowMore: () => void;
}) {
  const config = getEntityConfig(group.type);
  const hasMore = !isExpanded && totalAvailable > group.items.length;
  const remainingCount = totalAvailable - group.items.length;

  return (
    <div className="border-b border-border last:border-0">
      {/* Section Header - Colored */}
      <div
        className={cn(
          "sticky top-0 z-10 px-4 py-2 flex items-center gap-2",
          config.bgColor,
        )}
      >
        <span className="text-xs font-bold uppercase tracking-widest text-white">
          {config.label}
        </span>
        <span className="text-xs text-white/70">
          ({group.items.length}
          {totalAvailable > group.items.length
            ? ` of ${totalAvailable.toLocaleString()}`
            : ""}
          )
        </span>
      </div>

      {/* Entity Cards - Two Column Grid on Desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {group.items.map((item) => (
          <SuggestionCard
            key={item.id}
            item={item}
            config={config}
            onClick={() => onItemClick(item)}
          />
        ))}
      </div>

      {/* Show more button when there are more results */}
      {hasMore && (
        <button
          type="button"
          onClick={onShowMore}
          disabled={isExpanding}
          className="w-full px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isExpanding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <span>
              Show more {config.label.toLowerCase()} (
              {remainingCount.toLocaleString()} more)
            </span>
          )}
        </button>
      )}
    </div>
  );
}

// Shared Suggestion Card Component
function SuggestionCard({
  item,
  config,
  onClick,
}: {
  item: TypeaheadSuggestion;
  config: (typeof ENTITY_CONFIG)[EntityType];
  onClick: () => void;
}) {
  const linkCounts = buildLinkCounts(item.links, item.entity_type);

  // For studies: show ID, then display_name as "description"
  const isStudy = item.entity_type === "studies";
  const primaryText = isStudy ? item.id : item.display_name;

  // Build description text
  let descriptionText = null;
  if (isStudy && item.display_name !== item.id) {
    // For studies, show the study name (display_name) as description
    descriptionText =
      item.display_name.length > 80
        ? `${item.display_name.slice(0, 80).trim()}...`
        : item.display_name;
  } else if (item.description) {
    // For other entities, use actual description
    descriptionText =
      item.description.length > 80
        ? `${item.description.slice(0, 80).trim()}...`
        : item.description;
  }

  return (
    <ComboboxOption
      as="div"
      className="cursor-pointer transition-colors duration-150 data-[focus]:bg-muted border-b md:border-r border-border md:odd:border-r md:even:border-r-0 last:border-b-0"
      value={item}
      onClick={onClick}
    >
      <div className="px-4 py-4 h-full">
        {/* Name */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={cn("font-semibold text-sm", config.textColor)}>
            {primaryText}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
        </div>

        {/* Description - two lines max */}
        {descriptionText && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-2.5">
            {descriptionText}
          </p>
        )}

        {/* Link counts */}
        {linkCounts.length > 0 && (
          <div className="flex items-center gap-2.5 flex-wrap text-xs text-muted-foreground">
            {linkCounts.map((link) => (
              <span key={link.label} className="inline-flex items-center gap-1">
                <span className="font-medium text-muted-foreground">
                  {link.count.toLocaleString()}
                </span>
                <span className="text-muted-foreground">{link.label}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </ComboboxOption>
  );
}
