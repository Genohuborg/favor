"use client";

import { cn } from "@infra/utils";
import { Button } from "@shared/components/ui/button";
import { useAuth } from "@shared/hooks";
import { LogIn, Pin, PinOff, X } from "lucide-react";
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchHistory } from "../hooks/use-search-history";
import type { HistoryItem } from "../types/history";

const TYPE_LABEL: Record<string, string> = {
  genes: "gene",
  gene: "gene",
  variants: "variant",
  variant: "variant",
  diseases: "disease",
  disease: "disease",
  drugs: "drug",
  drug: "drug",
  pathways: "pathway",
  phenotypes: "phenotype",
  go_terms: "GO term",
  side_effects: "side effect",
  ccre: "cCRE",
  metabolites: "metabolite",
  signals: "signal",
  protein_domains: "domain",
  tissues: "tissue",
  cell_types: "cell type",
};

interface Props {
  onPickItem: (item: HistoryItem, options?: { openInNewTab?: boolean }) => void;
  onPickSuggestedQuery: (query: string) => void;
  suggestions: readonly string[];
}

export function SearchHistoryPanel({
  onPickItem,
  onPickSuggestedQuery,
  suggestions,
}: Props) {
  const { isAuthenticated, login } = useAuth();
  const { items, isLoading, remove, pin, clear } = useSearchHistory({
    kind: "search",
    limit: 10,
  });

  if (!isAuthenticated) {
    return (
      <SignedOut
        onLogin={login}
        suggestions={suggestions}
        onPickSuggestedQuery={onPickSuggestedQuery}
      />
    );
  }

  if (isLoading && items.length === 0) {
    return <Skeleton />;
  }

  if (items.length === 0) {
    return (
      <Empty
        suggestions={suggestions}
        onPickSuggestedQuery={onPickSuggestedQuery}
      />
    );
  }

  return (
    <List
      items={items}
      onPickItem={onPickItem}
      pin={pin}
      remove={remove}
      clear={clear}
    />
  );
}

// ─────────────────────────────────────────────────────────────────────

function List({
  items,
  onPickItem,
  pin,
  remove,
  clear,
}: {
  items: HistoryItem[];
  onPickItem: Props["onPickItem"];
  pin: (id: string, pinned: boolean) => void;
  remove: (id: string) => void;
  clear: (kind?: "search" | "view") => void;
}) {
  // Fold rows that point to the same display target
  const folded = useMemo(() => foldByDisplayKey(items), [items]);
  const pinned = useMemo(() => folded.filter((it) => it.pinned), [folded]);
  const recent = useMemo(() => folded.filter((it) => !it.pinned), [folded]);
  const display = useMemo(() => [...pinned, ...recent], [pinned, recent]);

  const [highlight, setHighlight] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const rowRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (highlight >= display.length)
      setHighlight(Math.max(0, display.length - 1));
  }, [display.length, highlight]);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 3000);
    return () => clearTimeout(t);
  }, [confirming]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (display.length === 0) return;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlight((h) => (h + 1) % display.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => (h - 1 + display.length) % display.length);
      } else if (e.key === "Enter") {
        const it = display[highlight];
        if (!it) return;
        e.preventDefault();
        onPickItem(it, { openInNewTab: e.metaKey || e.ctrlKey });
      } else if (
        (e.key === "Backspace" || e.key === "Delete") &&
        !(e.target instanceof HTMLInputElement && e.target.value.length > 0)
      ) {
        const it = display[highlight];
        if (!it) return;
        e.preventDefault();
        remove(it.id);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [display, highlight, onPickItem, remove]);

  useEffect(() => {
    rowRefs.current[highlight]?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  const handleClear = useCallback(() => {
    if (confirming) {
      clear("search");
      setConfirming(false);
    } else {
      setConfirming(true);
    }
  }, [confirming, clear]);

  let i = 0;
  const renderRow = (it: HistoryItem) => {
    const idx = i++;
    return (
      <Row
        key={it.id}
        ref={(el) => {
          rowRefs.current[idx] = el;
        }}
        item={it}
        isHighlighted={idx === highlight}
        onHover={() => setHighlight(idx)}
        onClick={(e) =>
          onPickItem(it, { openInNewTab: e.metaKey || e.ctrlKey })
        }
        onPin={() => pin(it.id, !it.pinned)}
        onRemove={() => remove(it.id)}
      />
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between px-5 py-2 border-b border-border">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {pinned.length > 0 ? "Pinned" : "Recent"}
        </span>
        <button
          type="button"
          onClick={handleClear}
          onMouseLeave={() => setConfirming(false)}
          className={cn(
            "text-[11px] transition-colors",
            confirming
              ? "text-destructive font-semibold"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {confirming ? "Click again to confirm" : "Clear all"}
        </button>
      </div>

      {pinned.length > 0 && <ul className="py-1">{pinned.map(renderRow)}</ul>}

      {pinned.length > 0 && recent.length > 0 && (
        <div className="px-5 py-1.5 text-[11px] uppercase tracking-wider text-muted-foreground border-y border-border bg-muted/30">
          Recent
        </div>
      )}

      {recent.length > 0 && <ul className="py-1">{recent.map(renderRow)}</ul>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────

const Row = ({
  ref,
  item,
  isHighlighted,
  onHover,
  onClick,
  onPin,
  onRemove,
}: {
  ref?: React.Ref<HTMLLIElement>;
  item: HistoryItem;
  isHighlighted: boolean;
  onHover: () => void;
  onClick: (e: ReactMouseEvent) => void;
  onPin: () => void;
  onRemove: () => void;
}) => {
  const typeLabel = item.entityType ? TYPE_LABEL[item.entityType] : undefined;
  return (
    <li
      ref={ref}
      onMouseMove={onHover}
      className={cn(
        "group flex items-center gap-2 pl-5 pr-2 transition-colors",
        isHighlighted ? "bg-muted" : "hover:bg-muted/60",
      )}
    >
      <button
        type="button"
        onClick={onClick}
        className="flex-1 flex items-center gap-3 text-left min-w-0 py-2"
      >
        <span className="flex-1 min-w-0 flex items-center gap-2">
          <span className="text-sm text-foreground truncate">
            {item.entityLabel ?? item.query ?? "—"}
          </span>
          {typeLabel && (
            <span className="shrink-0 text-[11px] text-muted-foreground">
              {typeLabel}
            </span>
          )}
        </span>
        <span className="text-[11px] text-muted-foreground/70 shrink-0 tabular-nums">
          {relativeTime(item.lastUsedAt)}
        </span>
      </button>

      <button
        type="button"
        aria-label={item.pinned ? "Unpin" : "Pin"}
        onClick={(e) => {
          e.stopPropagation();
          onPin();
        }}
        className={cn(
          "p-1.5 rounded text-muted-foreground hover:text-foreground transition-colors",
          item.pinned
            ? "opacity-100"
            : "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100",
        )}
      >
        {item.pinned ? (
          <PinOff className="w-3.5 h-3.5" />
        ) : (
          <Pin className="w-3.5 h-3.5" />
        )}
      </button>
      <button
        type="button"
        aria-label="Remove"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-1.5 rounded text-muted-foreground hover:text-destructive opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </li>
  );
};

// ─────────────────────────────────────────────────────────────────────

function SignedOut({
  onLogin,
  suggestions,
  onPickSuggestedQuery,
}: {
  onLogin: () => void;
  suggestions: readonly string[];
  onPickSuggestedQuery: (q: string) => void;
}) {
  return (
    <div className="py-8 px-6 text-center">
      <div className="text-sm text-foreground mb-1">
        Sign in to keep your search history
      </div>
      <div className="text-xs text-muted-foreground mb-4">
        Recent searches sync across your devices.
      </div>
      <Button type="button" size="sm" onClick={onLogin} className="mb-5">
        <LogIn />
        Sign in
      </Button>
      <Chips
        label="Or try"
        suggestions={suggestions}
        onPick={onPickSuggestedQuery}
      />
    </div>
  );
}

function Empty({
  suggestions,
  onPickSuggestedQuery,
}: {
  suggestions: readonly string[];
  onPickSuggestedQuery: (q: string) => void;
}) {
  return (
    <div className="py-10 px-6 text-center">
      <div className="text-sm text-muted-foreground mb-3">
        No recent searches yet.
      </div>
      <Chips
        label="Try"
        suggestions={suggestions}
        onPick={onPickSuggestedQuery}
      />
    </div>
  );
}

function Skeleton() {
  return (
    <ul className="py-1">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex items-center px-5 py-2 animate-pulse">
          <span className="flex-1 min-w-0 space-y-1.5">
            <span className="block h-3.5 w-2/5 rounded bg-muted" />
            <span className="block h-3 w-1/4 rounded bg-muted/60" />
          </span>
        </li>
      ))}
    </ul>
  );
}

function Chips({
  label,
  suggestions,
  onPick,
}: {
  label: string;
  suggestions: readonly string[];
  onPick: (q: string) => void;
}) {
  return (
    <>
      <div className="text-xs text-muted-foreground/70 mb-2">{label}</div>
      <div className="flex justify-center gap-2 flex-wrap">
        {suggestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick(q)}
            className="px-3 py-1 rounded-full bg-muted hover:bg-muted/70 text-xs font-medium text-foreground transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────

function foldByDisplayKey(items: HistoryItem[]): HistoryItem[] {
  type Bucket = { item: HistoryItem; firstSeen: number };
  const byKey = new Map<string, Bucket>();
  const norm = (s?: string) => (s ?? "").trim().toLowerCase();
  const richness = (it: HistoryItem) =>
    (it.entityType ? 2 : 0) + (it.entityId ? 1 : 0);

  let order = 0;
  for (const it of items) {
    const keys = [norm(it.entityLabel), norm(it.query)].filter(Boolean);
    if (keys.length === 0) {
      byKey.set(`__id:${it.id}`, { item: it, firstSeen: order++ });
      continue;
    }
    const existing = keys
      .map((k) => byKey.get(k))
      .find((b): b is Bucket => Boolean(b));
    if (existing) {
      if (
        richness(it) > richness(existing.item) ||
        (it.pinned && !existing.item.pinned)
      ) {
        existing.item = it;
      }
      for (const k of keys) byKey.set(k, existing);
    } else {
      const bucket = { item: it, firstSeen: order++ };
      for (const k of keys) byKey.set(k, bucket);
    }
  }

  return Array.from(new Set(byKey.values()))
    .sort((a, b) => a.firstSeen - b.firstSeen)
    .map((b) => b.item);
}

function relativeTime(iso: string): string {
  const sec = Math.max(
    0,
    Math.floor((Date.now() - new Date(iso).getTime()) / 1000),
  );
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86_400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86_400)}d ago`;
}
