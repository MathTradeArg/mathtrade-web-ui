import clsx from "clsx";
import type { ReactNode } from "react";

// One style for every view switch (Visual/Grilla, Juegos/Ejemplares,
// Actual/Historial…): a light capsule holding the options, the active one
// filled in the primary color. Used by <Tabs> and by the results view pills.
export const SegmentedGroup = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    role="group"
    className={clsx(
      "inline-flex flex-wrap items-center gap-1 p-1 rounded-full bg-gray-100 border border-gray-200",
      className
    )}
  >
    {children}
  </div>
);

export const SegmentButton = ({
  active = false,
  onClick,
  children,
  small = false,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  small?: boolean;
}) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={clsx(
      "relative rounded-full font-semibold transition-colors whitespace-nowrap",
      small ? "h-7 px-3 text-xs" : "h-9 px-4 text-sm",
      active
        ? "bg-primary text-white shadow-sm cursor-default"
        : "text-gray-600 hover:text-primary hover:bg-white"
    )}
  >
    {children}
  </button>
);
