import I18N from "@/i18n";
import clsx from "clsx";
import type { ReactNode } from "react";
import { Die, Meeple } from "@/components/illustrations";

const COLORS = {
  mint: "bg-mint",
  sky: "bg-sky",
  peach: "bg-peach",
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
        "text-ink rounded-main p-5 h-full flex flex-col gap-1.5",
        COLORS[color],
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
        <Meeple fill="#ffffff" className="w-14 h-14 mt-auto self-end" />
      ) : null}
      {art === "die" ? (
        <Die fill="#ffffff" className="w-14 h-14 mt-auto self-end" />
      ) : null}
    </div>
  );
};

export default Pill;
