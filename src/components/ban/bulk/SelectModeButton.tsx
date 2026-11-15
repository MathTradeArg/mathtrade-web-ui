"use client";
import clsx from "clsx";
import Icon from "@/components/icon";
import I18N, { getI18Ntext } from "@/i18n";
import useBulkSelect from "./useBulkSelect";

// "Seleccionar" / "Listo" in the list header (same pill as PageSize).
const SelectModeButton = ({ className = "" }: { className?: string }) => {
  const { selecting, start, cancel } = useBulkSelect();

  return (
    <div
      className={clsx("shrink-0", className)}
      data-tooltip={selecting ? undefined : getI18Ntext("ban.bulk.select.tooltip")}
    >
      <button
        type="button"
        aria-pressed={selecting}
        className={clsx(
          "flex items-center gap-1.5 h-10 px-2.5 rounded-xl border text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
          selecting
            ? "bg-primary border-primary text-white hover:opacity-75"
            : "bg-white border-line text-ink-muted hover:border-ink/30 hover:text-ink focus-visible:bg-surface-soft"
        )}
        onClick={selecting ? cancel : start}
      >
        <Icon type={selecting ? "check" : "square"} className="text-[13px]" />
        <I18N id={selecting ? "ban.bulk.done" : "ban.bulk.select"} />
      </button>
    </div>
  );
};

export default SelectModeButton;
