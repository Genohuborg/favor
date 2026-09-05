"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Autocomplete } from "@/components/ui/autocomplete";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDebounce } from "@/lib/hooks/use-debounce";
import { useSearchHistory } from "@/lib/hooks/use-search-history";
import { useSearchSuggestions } from "@/lib/hooks/use-search-suggestions";
import { useSavedSearches } from "@/lib/hooks/use-saved-searches";
import {
  formatSearchInput,
  getPlaceholderText,
  type InputFormatResult,
} from "@/lib/search/formatting/input-formatter";
import { validateAndNavigate } from "@/lib/search/navigation";
import { validateQuery } from "@/lib/search/validation";
import {
  type GenomicBuild,
  useSearchActions,
  useSearchAlert,
  useSearchInput,
} from "@/lib/stores/search-store";
import { SaveSearchDialog } from "@/components/features/search/save-search-dialog";

export function GenomicSearch() {
  const { inputValue, selectedGenome } = useSearchInput();
  const { showAlert, alertMessage } = useSearchAlert();
  const { setInputValue, setSelectedGenome, showError } = useSearchActions();
  const router = useRouter();
  const { addToHistory, getRecentSearches, removeFromHistory } =
    useSearchHistory();
  const { saveSearch, getSavedSearchItems, deleteSavedSearch } =
    useSavedSearches();

  const debouncedInput = useDebounce(inputValue.trim(), 300);
  const inputFormat: InputFormatResult = useMemo(
    () => formatSearchInput(debouncedInput),
    [debouncedInput],
  );
  // Typeahead re-enabled 2026-09-05. It was force-disabled in 02c21c7 because
  // the /suggestions endpoint had no backing store: its Elasticsearch index
  // `autocomplete_combined` did not survive the NERC migration, so every call
  // 500'd. The index has been rebuilt on Jetstream2 (genes) and rsid
  // suggestions now come from ClickHouse, so the endpoint answers again.
  const { suggestions, isLoading, hasError } = useSearchSuggestions({
    query: debouncedInput,
    shouldShowSuggestions: inputFormat.shouldShowSuggestions,
    selectedGenome,
    recentSearches: [...getSavedSearchItems(), ...getRecentSearches(4)],
  });

  const handleInputChange = useCallback(
    (value: string) => {
      const formatted = formatSearchInput(value);
      setInputValue(formatted.formattedValue);
    },
    [setInputValue],
  );

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const query = inputValue.trim();
      if (!query) {
        showError("Please enter a search query");
        return;
      }

      const validation = validateQuery(query);
      if (!validation.isValid || !validation.type) {
        showError(validation.error || "Invalid search format");
        return;
      }

      const navigation = validateAndNavigate(
        query,
        validation.type,
        selectedGenome,
      );
      if (!navigation.success) {
        showError(navigation.error || "Navigation failed");
        return;
      }
      addToHistory(query);
      if (navigation.path) {
        router.push(navigation.path);
      }
    },
    [inputValue, selectedGenome, addToHistory, router, showError],
  );

  const handleGenomeChange = useCallback(
    (value: string | undefined) => {
      if (value) {
        setSelectedGenome(value as GenomicBuild);
      }
    },
    [setSelectedGenome],
  );

  const placeholderText = useMemo(() => getPlaceholderText(), []);

  const handleSaveSearch = useCallback(
    (name: string, description?: string) => {
      saveSearch(inputValue, name, selectedGenome, description);
    },
    [inputValue, selectedGenome, saveSearch],
  );

  if (hasError) {
    console.warn("Search suggestions API error");
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <div className="max-w-[520px] w-full mx-auto">
          <Autocomplete
            options={suggestions}
            value={inputValue}
            onValueChange={setInputValue}
            onInputChange={handleInputChange}
            placeholder={placeholderText}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            className="w-full"
            startContent={
              <div className="flex items-center space-x-3">
                <ToggleGroup
                  type="single"
                  value={selectedGenome}
                  onValueChange={handleGenomeChange}
                  className="pr-2 mx-0"
                >
                  <ToggleGroupItem
                    value="hg38"
                    className="data-[state=on]:bg-primary rounded-lg data-[state=on]:text-background font-mono text-xs px-2 py-1"
                  >
                    HG38
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="hg19"
                    className="data-[state=on]:bg-primary rounded-lg data-[state=on]:text-background font-mono text-xs px-2 py-1"
                  >
                    HG19
                  </ToggleGroupItem>
                </ToggleGroup>
                <div className="w-px h-6 bg-slate-300 my-auto" />
              </div>
            }
            endContent={
              inputValue.trim() ? (
                <SaveSearchDialog
                  query={inputValue}
                  genomicBuild={selectedGenome}
                  onSave={handleSaveSearch}
                />
              ) : undefined
            }
          >
            {(item) => (
              <div className="p-3 group">
                <div className="w-full text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-primary truncate text-xs">
                      {item.value}
                    </span>
                  </div>

                  {item.type === "rsid" && (
                    <div className="text-xs text-muted-foreground flex gap-2 flex-wrap">
                      {item.data?.variant_vcf && (
                        <span className="font-mono">
                          {item.data.variant_vcf}
                        </span>
                      )}
                      {item.data?.snp_type && (
                        <span>
                          {item.data.snp_type === "SNV" ? "SNV" : "InDel"}
                        </span>
                      )}
                      {item.data?.clnsig && (
                        <span className="text-muted-foreground/80">
                          {item.data.clnsig}
                        </span>
                      )}
                    </div>
                  )}

                  {item.type === "variant" && item.data?.snp_type && (
                    <div className="text-xs text-muted-foreground">
                      {item.data.snp_type}
                    </div>
                  )}

                  {item.type === "gene" && item.data?.chromosome && (
                    <div className="text-xs text-muted-foreground">
                      {item.data.chromosome}
                      {item.data.position && ` • ${item.data.position}`}
                    </div>
                  )}

                  {item.type === "history" && (
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground italic">
                        Recent search
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          removeFromHistory(item.value);
                        }}
                        className="h-auto p-1 text-xs opacity-0 group-hover:opacity-100 hover:text-destructive"
                        aria-label={`Remove "${item.value}" from recent searches`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}

                  {item.type === "saved" && (
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-primary italic">
                        ★ {item.data?.name}
                        {item.data?.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.data.description}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          e.nativeEvent.stopImmediatePropagation();
                          deleteSavedSearch(item.id);
                        }}
                        className="h-auto p-1 text-xs opacity-0 group-hover:opacity-100 hover:text-destructive"
                        aria-label={`Delete saved search "${item.data?.name}"`}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Autocomplete>
        </div>

        {showAlert && (
          <Alert variant="destructive" className="max-w-lg mt-4">
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" className="mt-8" variant="default">
          Search
        </Button>
      </form>
    </div>
  );
}
