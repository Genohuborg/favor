"use client";

import { cn } from "@infra/utils";
import { Button } from "@shared/components/ui/button";
import { Label } from "@shared/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@shared/components/ui/radio-group";
import { useCallback, useId, useMemo, useState } from "react";
import { formatNumber } from "../lib/format";
import type {
  SchemaPreviewColumn,
  TypedValidateResponse,
  VariantKeyAlternative,
} from "../types";

interface VariantKeyPickerProps {
  typedValidation: TypedValidateResponse;
  onConfirm: (choice: VariantKeyAlternative) => void;
  onBack: () => void;
  className?: string;
}

type SpeedLevel = "fastest" | "fast" | "slow";
type KeyKind = "vcf_columns" | "spdi" | "rsid" | "vid";

interface KindDescriptor {
  label: string;
  speed: { label: string; level: SpeedLevel };
  detail: string;
}

/**
 * Single source of truth for kind → presentation mapping.
 * All UI-visible strings for a key kind live here.
 */
const KIND_DESCRIPTORS: Record<KeyKind, KindDescriptor> = {
  vcf_columns: {
    label: "chromosome-position-ref-alt",
    speed: { label: "Fastest", level: "fastest" },
    detail: "Covers variants that have no rsID.",
  },
  spdi: {
    label: "SPDI",
    speed: { label: "Fast", level: "fast" },
    detail: "Resolved to chromosome-position-ref-alt internally.",
  },
  rsid: {
    label: "rsID",
    speed: { label: "Slow", level: "slow" },
    detail:
      "Every variant requires an rsID lookup, and not all variants have one. Prefer VCF coordinates when available.",
  },
  vid: {
    label: "Variant ID",
    speed: { label: "Fast", level: "fast" },
    detail: "",
  },
};

function kindOf(alt: VariantKeyAlternative): KeyKind {
  if (alt.strategy === "vcf_columns") return "vcf_columns";
  switch (alt.key_type) {
    case "VCF":
      return "spdi";
    case "RSID":
      return "rsid";
    case "VID":
    case "AUTO":
    case "UNKNOWN":
      return "vid";
  }
}

interface Describable {
  /** Stable identity for radio state. */
  id: string;
  /** Source columns from the user's file backing this key. */
  columns: string[];
  /** One concrete value assembled from schema_preview, or null when unknowable. */
  example: string | null;
  /** Rows where every referenced column is populated, or null when unknowable. */
  coveredRows: number | null;
  /** Presentation for this key kind. */
  kind: KindDescriptor;
}

function identityOf(alt: VariantKeyAlternative): string {
  return `${alt.strategy}:${alt.columns.join("|")}`;
}

/** Min populated-row count across columns; null if any column is empty. */
function minNonNullCount(cols: SchemaPreviewColumn[]): number | null {
  const counts = cols.map((c) => c.non_null_count);
  if (counts.some((n) => n <= 0)) return null;
  return Math.min(...counts);
}

/** First row index 0..2 where every column has a non-empty sample value. */
function buildExample(cols: SchemaPreviewColumn[]): string | null {
  const maxRow = Math.min(...cols.map((c) => c.sample_values.length), 3);
  for (let i = 0; i < maxRow; i++) {
    const parts = cols.map((c) => c.sample_values[i]);
    if (parts.every((v): v is string => Boolean(v))) return parts.join("-");
  }
  return null;
}

function describe(
  alt: VariantKeyAlternative,
  schemaByName: Map<string, SchemaPreviewColumn>,
): Describable {
  const lookups = alt.columns.map((name) => schemaByName.get(name));
  // If any referenced column is absent from the schema preview, we can't
  // honestly report coverage or build an example. Surface as unknown.
  const cols = lookups.every((c): c is SchemaPreviewColumn => c !== undefined)
    ? lookups
    : null;

  return {
    id: identityOf(alt),
    columns: alt.columns,
    example: cols ? buildExample(cols) : null,
    coveredRows: cols ? minNonNullCount(cols) : null,
    kind: KIND_DESCRIPTORS[kindOf(alt)],
  };
}

export function VariantKeyPicker({
  typedValidation,
  onConfirm,
  onBack,
  className,
}: VariantKeyPickerProps) {
  const groupId = useId();
  const alternatives = typedValidation.variant_key_alternatives;

  const schemaByName = useMemo(() => {
    const m = new Map<string, SchemaPreviewColumn>();
    for (const c of typedValidation.schema_preview) {
      m.set(c.original_name, c);
    }
    return m;
  }, [typedValidation.schema_preview]);

  const options = useMemo(
    () => alternatives.map((alt) => ({ alt, ...describe(alt, schemaByName) })),
    [alternatives, schemaByName],
  );

  const bestCoverage = useMemo(() => {
    const counts = options
      .map((o) => o.coveredRows)
      .filter((n): n is number => n !== null);
    return counts.length > 0 ? Math.max(...counts) : null;
  }, [options]);

  const [selectedId, setSelectedId] = useState<string>(
    () => options[0]?.id ?? "",
  );

  const handleConfirm = useCallback(() => {
    const picked = options.find((o) => o.id === selectedId);
    if (picked) onConfirm(picked.alt);
  }, [options, selectedId, onConfirm]);

  if (options.length === 0) return null;

  const rowTotal = typedValidation.row_count_estimate;

  return (
    <div className={cn("space-y-6", className)}>
      <h2 className="text-lg font-semibold text-foreground">
        Which column identifies each variant?
      </h2>

      <RadioGroup
        value={selectedId}
        onValueChange={setSelectedId}
        className="gap-2"
      >
        {options.map((opt) => {
          const inputId = `${groupId}-${opt.id}`;
          const isActive = selectedId === opt.id;
          const isBest =
            opt.coveredRows !== null &&
            bestCoverage !== null &&
            opt.coveredRows === bestCoverage;
          const coverageText =
            opt.coveredRows !== null
              ? `${formatNumber(opt.coveredRows)} of ${formatNumber(rowTotal)}`
              : null;
          const speedClass =
            opt.kind.speed.level === "fastest"
              ? "text-emerald-700"
              : opt.kind.speed.level === "slow"
                ? "text-amber-700"
                : "text-muted-foreground";

          return (
            <Label
              key={opt.id}
              htmlFor={inputId}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors",
                isActive
                  ? "border-primary bg-primary/[0.03]"
                  : "border-border hover:bg-muted/40",
              )}
            >
              <RadioGroupItem id={inputId} value={opt.id} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="font-mono text-sm font-medium text-foreground truncate">
                    {opt.kind.label}
                  </div>
                  <div
                    className={cn(
                      "shrink-0 text-xs font-medium tracking-tight",
                      speedClass,
                    )}
                  >
                    {opt.kind.speed.label}
                  </div>
                </div>
                <div className="mt-1 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-0.5 text-xs items-baseline">
                  <span className="uppercase tracking-wider text-[10px] text-muted-foreground/70">
                    {opt.columns.length === 1 ? "Column" : "Columns"}
                  </span>
                  <span className="font-mono text-muted-foreground truncate">
                    {opt.columns.join(", ")}
                  </span>
                  {opt.example && (
                    <>
                      <span className="uppercase tracking-wider text-[10px] text-muted-foreground/70">
                        Example
                      </span>
                      <span className="font-mono text-muted-foreground truncate">
                        {opt.example}
                      </span>
                    </>
                  )}
                  {coverageText && (
                    <>
                      <span className="uppercase tracking-wider text-[10px] text-muted-foreground/70">
                        Coverage
                      </span>
                      <span
                        className={cn(
                          "tabular-nums",
                          isBest
                            ? "text-emerald-700 font-medium"
                            : "text-muted-foreground",
                        )}
                      >
                        {coverageText}
                      </span>
                    </>
                  )}
                </div>
                {opt.kind.detail && (
                  <p
                    className={cn(
                      "mt-1.5 text-xs leading-relaxed",
                      opt.kind.speed.level === "slow"
                        ? "text-amber-700/80"
                        : "text-muted-foreground",
                    )}
                  >
                    {opt.kind.detail}
                  </p>
                )}
              </div>
            </Label>
          );
        })}
      </RadioGroup>

      <div className="flex items-center justify-between gap-4 pt-3 border-t border-border">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={handleConfirm}>
          Continue
        </Button>
      </div>
    </div>
  );
}
