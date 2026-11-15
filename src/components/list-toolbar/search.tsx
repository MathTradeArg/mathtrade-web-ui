"use client";
import { useEffect, useRef, useState } from "react";
import Icon from "@/components/icon";
import { getI18Ntext } from "@/i18n";

const SEARCH_DEBOUNCE_MS = 300;

const ListSearch = ({
  value = "",
  onChange = (_keyword: string) => {},
  placeholder = "",
  tourAnchor = undefined, // data-tour for the guided tutorial (src/tours)
}) => {
  // Local value so typing stays snappy; commit to filters after a short pause
  // so each keystroke does not fire a list fetch (and trip autoLoad guards).
  const [draft, setDraft] = useState(value);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (draft === (value || "")) return;
    const t = setTimeout(() => {
      onChangeRef.current(draft);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [draft, value]);

  return (
    <label
      data-tour={tourAnchor}
      className="flex w-full min-w-0 items-center gap-2 rounded-xl border border-line bg-white px-3 h-10 shadow-[0_1px_0_rgb(0_0_0/0.04)] focus-within:ring-2 focus-within:ring-ink/30"
    >
      <Icon type="search" className="shrink-0 text-sm text-ink-muted" />
      <input
        autoComplete="off"
        type="search"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={
          placeholder || getI18Ntext("filter.Search.placeholder.short")
        }
        aria-label={getI18Ntext("filter.Search")}
        className="min-w-0 flex-1 bg-transparent text-body text-gray-900 placeholder:text-gray-400 outline-none"
      />
    </label>
  );
};

export default ListSearch;
