import I18N from "@/i18n";
import clsx from "clsx";

// Underlined tabs for page navigation (Juegos / Ejemplares, Resultados /
// Cadenas...), left aligned. Mode selectors inside forms and toolbars keep
// using <SegmentedGroup>. Tabs sitting above a container get 20px of air so the
// underline never touches the box border; pass `flush` when the tabs live
// inside the container (its own padding handles the spacing).
const Tabs = ({
  list = [],
  onChange = (_k?: number) => {},
  highlighted = -1,
  value = 0,
  min = false,
  className = "",
  toLeft: _toLeft = true,
  flush = false,
}) => {
  return (
    <div
      role="tablist"
      className={clsx(
        "flex flex-wrap items-end gap-x-8 border-b border-line",
        !flush && "mb-5",
        className
      )}
    >
      {list?.map((name, k) => {
        const active = k === value;
        return (
          <button
            key={name}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => {
              if (onChange && k !== value) onChange(k);
            }}
            className={clsx(
              "relative -mb-px whitespace-nowrap border-b-[3px] px-1 transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 rounded-t",
              min ? "min-h-9 text-xs" : "min-h-12 text-[17px] md:text-[19px] tracking-[-0.01em]",
              active
                ? "border-ink text-ink font-semibold cursor-default"
                : "border-transparent text-ink-muted font-medium hover:text-ink hover:border-line"
            )}
          >
            <I18N id={name} />
            {highlighted === k ? (
              <span className="absolute -top-1.5 -right-1 bg-red-600 text-white leading-none font-bold uppercase text-[8px] px-1 py-[2px] rounded">
                Nuevo
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
