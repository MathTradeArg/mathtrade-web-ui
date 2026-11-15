"use client";
import clsx from "clsx";
import Icon from "@/components/icon";
import { colorTagStyles } from "@/utils/color";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type FilterChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  ghost?: boolean;
  quiet?: boolean; // toolbar variant: unselected chips are plain text until hover
  color?: string;
  onRemove?: () => void;
  children?: ReactNode;
};

const FilterChip = ({
  selected = false,
  ghost = false,
  quiet = false,
  color = "",
  onRemove,
  children = null,
  className = "",
  type = "button",
  ...rest
}: FilterChipProps) => {
  const colored = Boolean(selected && color);
  return (
    <button
      type={type}
      className={clsx(
        "inline-flex max-w-full items-center gap-1 rounded-lg border border-transparent px-2.5 py-1 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
        quiet && "min-h-9 text-[13px] font-medium",
        ghost && "border border-dashed border-gray-400 bg-transparent text-gray-600",
        selected && ghost && "border-primary bg-primary/10 text-primary",
        selected && !colored && !ghost && "border-ink bg-ink text-white",
        !selected && !ghost && !quiet && "border-line bg-white text-ink hover:bg-surface-strong",
        !selected && !ghost && quiet && "text-ink-muted hover:bg-surface-soft hover:text-ink focus-visible:bg-surface-soft",
        className
      )}
      style={colored ? colorTagStyles(color) : undefined}
      {...rest}
    >
      <span className="truncate">{children}</span>
      {onRemove ? (
        <Icon type="close" className="text-[11px] shrink-0 opacity-80" />
      ) : null}
    </button>
  );
};

export default FilterChip;
