"use client";

import { Badge } from "@infra/table/column-builder";
import { Card, CardContent } from "@shared/components/ui/card";
import { ExternalLink } from "@shared/components/ui/external-link";
import { useState } from "react";
import type { ComplexRow, ProteinSummary, TranscriptRow } from "./types";

// =============================================================================
// Identity strip (rendered above the domain map)
// =============================================================================

export function ProteinHeader({ protein }: { protein: ProteinSummary }) {
  const facts = [
    protein.uniprotId,
    protein.lengthAa !== null
      ? `${protein.lengthAa.toLocaleString()} aa`
      : null,
    protein.massDa !== null
      ? `${Math.round(protein.massDa / 1000).toLocaleString()} kDa`
      : null,
  ].filter(Boolean) as string[];

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <span className="text-base font-semibold text-foreground">
          {protein.mnemonic ?? protein.uniprotId}
        </span>
        {facts.map((fact) => (
          <span
            key={fact}
            className="text-sm text-muted-foreground before:content-['·'] before:mr-2.5 before:text-border first:before:content-none"
          >
            {fact}
          </span>
        ))}
        <ExternalLink
          href={`https://www.uniprot.org/uniprotkb/${protein.uniprotId}`}
          className="text-sm ml-1"
          iconSize="sm"
        >
          UniProt
        </ExternalLink>
      </div>
      {protein.functionDescription && (
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {protein.functionDescription}
        </p>
      )}
    </div>
  );
}

// =============================================================================
// Isoforms + Complexes panels (rendered below the domain map)
// =============================================================================

function PanelHeading({ label, count }: { label: string; count: number }) {
  return (
    <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
      {label} <span className="tabular-nums">({count})</span>
    </div>
  );
}

function IsoformList({ isoforms }: { isoforms: TranscriptRow[] }) {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? isoforms : isoforms.slice(0, 5);
  const rest = isoforms.length - shown.length;

  return (
    <div>
      <PanelHeading label="Isoforms" count={isoforms.length} />
      <ul className="divide-y divide-border/60">
        {shown.map((t) => {
          const principal = t.isManeSelect || t.isCanonical;
          return (
            <li
              key={t.transcriptId}
              className="flex items-center gap-2 py-1.5 text-sm"
            >
              <span
                className={
                  principal
                    ? "w-1.5 h-1.5 rounded-full bg-foreground shrink-0"
                    : "w-1.5 h-1.5 rounded-full bg-border shrink-0"
                }
              />
              <ExternalLink
                href={`https://www.ensembl.org/Homo_sapiens/Transcript/Summary?t=${t.transcriptId}`}
                className="font-medium"
                iconSize="sm"
              >
                {t.name}
              </ExternalLink>
              {t.isManeSelect && <Badge color="emerald">MANE</Badge>}
              {!t.isManeSelect && t.isCanonical && (
                <Badge color="blue">Canonical</Badge>
              )}
              {t.transcriptType && (
                <span className="ml-auto text-xs text-muted-foreground">
                  {t.transcriptType.replace(/_/g, " ")}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {rest > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="mt-2 text-xs text-primary hover:underline"
        >
          Show all {isoforms.length}
        </button>
      )}
    </div>
  );
}

function ComplexList({ complexes }: { complexes: ComplexRow[] }) {
  return (
    <div>
      <PanelHeading label="Complexes" count={complexes.length} />
      <ul className="divide-y divide-border/60">
        {complexes.map((c) => {
          const meta = [
            c.assembly,
            c.nComponents !== null ? `${c.nComponents} subunits` : null,
            c.stoichiometry,
          ]
            .filter(Boolean)
            .join(" · ");
          return (
            <li
              key={c.complexId}
              className="flex items-baseline gap-2 py-1.5 text-sm"
            >
              <ExternalLink
                href={`https://www.ebi.ac.uk/complexportal/complex/${c.complexId}`}
                className="font-medium"
                iconSize="sm"
              >
                {c.name}
              </ExternalLink>
              {meta && (
                <span className="ml-auto text-xs text-muted-foreground text-right">
                  {meta}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ProteinPanels({
  isoforms,
  complexes,
}: {
  isoforms: TranscriptRow[];
  complexes: ComplexRow[];
}) {
  if (isoforms.length === 0 && complexes.length === 0) return null;

  return (
    <Card className="border border-border">
      <CardContent className="grid grid-cols-1 gap-x-12 gap-y-8 px-6 py-5 md:grid-cols-2">
        {isoforms.length > 0 && <IsoformList isoforms={isoforms} />}
        {complexes.length > 0 && <ComplexList complexes={complexes} />}
      </CardContent>
    </Card>
  );
}
