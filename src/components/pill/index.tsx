import I18N from "@/i18n";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Die, Meeple } from "@/components/illustrations";

// White data card; the color only tints the illustration.
const COLORS = {
  mint: "#a4d4c5",
  sky: "#b4bdf5",
  peach: "#ffb084",
};

type PillProps = {
  value: ReactNode;
  label: string;
  footer?: ReactNode;
  color?: keyof typeof COLORS;
  className?: string;
  art?: "meeple" | "die";
};

const Pill = ({
  value,
  label,
  footer = null,
  color = "mint",
  className = "",
  art,
}: PillProps) => {
  return (
    <div
      className={clsx(
        "text-ink bg-card border border-line shadow-card rounded-card p-5 h-full flex flex-col gap-1.5",
        className
      )}
    >
      <div className="font-display text-5xl font-semibold leading-none">
        {value}
      </div>
      <div className="text-body-lg font-semibold text-balance">
        <I18N id={label} />
      </div>
      {footer ? <div className="text-sm pt-3 text-ink/80">{footer}</div> : null}
      {art === "meeple" ? (
        <Meeple fill={COLORS[color]} className="w-14 h-14 mt-auto self-end" />
      ) : null}
      {art === "die" ? (
        <Die fill={COLORS[color]} className="w-14 h-14 mt-auto self-end" />
      ) : null}
    </div>
  );
};

export default Pill;
