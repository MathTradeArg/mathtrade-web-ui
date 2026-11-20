"use client";
import { useEffect, useId, useState, type ReactNode } from "react";
import Icon from "@/components/icon";

// The choice lives for the browser session only (per-viewer convenience);
// storage can be blocked, so every access is guarded.
const readOpen = (storageKey: string | undefined, fallback: boolean) => {
  if (!storageKey) return fallback;
  try {
    const stored = window.sessionStorage.getItem(storageKey);
    return stored === null ? fallback : stored === "1";
  } catch {
    return fallback;
  }
};

const writeOpen = (storageKey: string | undefined, open: boolean) => {
  if (!storageKey) return;
  try {
    window.sessionStorage.setItem(storageKey, open ? "1" : "0");
  } catch {
    // Not persisted: the component state still works.
  }
};

// Section of the admin Pagos tab that can be shrunk: the header (title and
// counters) stays visible, `actions` sit next to it and the body folds away.
const CollapsibleSection = ({
  title,
  summary,
  actions,
  defaultOpen,
  storageKey,
  children,
}: {
  title: ReactNode;
  summary?: ReactNode;
  actions?: ReactNode;
  defaultOpen: boolean;
  storageKey?: string;
  children: ReactNode;
}) => {
  const bodyId = useId();
  // Same value on the server and on first client render; the stored choice is
  // applied after mount (no hydration mismatch).
  const [stored, setStored] = useState<boolean | null>(null);
  useEffect(() => {
    setStored(readOpen(storageKey, defaultOpen));
  }, [storageKey, defaultOpen]);
  const open = stored ?? defaultOpen;
  const toggle = () => {
    setStored(!open);
    writeOpen(storageKey, !open);
  };

  return (
    <section className="mt-6 w-full min-w-0 max-w-full">
      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-start gap-2">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={toggle}
          className="flex items-start gap-2 text-left flex-1 min-w-0 rounded-md py-1 hover:text-ink"
        >
          <Icon
            type="chevron-down"
            className={`text-xs text-ink-muted mt-1.5 shrink-0 transition-transform ${
              open ? "" : "-rotate-90"
            }`}
          />
          <span className="min-w-0">
            <span className="block font-semibold text-ink break-words">
              {title}
            </span>
            {summary ? (
              <span className="block text-xs text-gray-600 break-words">
                {summary}
              </span>
            ) : null}
          </span>
        </button>
        {actions ? <div className="w-full sm:w-auto">{actions}</div> : null}
      </div>
      <div id={bodyId} hidden={!open} className="mt-2">
        {children}
      </div>
    </section>
  );
};

export default CollapsibleSection;
