import clsx from "clsx";
import type { ReactNode } from "react";

const TONES: Record<string, string> = {
  // Data chips (players, language, box size, categories...) live on white
  // cards now, so they carry their own soft cream fill instead of a white
  // one. No border: the fill alone separates them from the card.
  neutral: "text-ink-muted bg-surface-soft",
  // For a value that asks the user to do something rather than describing the
  // copy. Tinted instead of solid: these chips sit inside cards that already
  // carry a background tint of their own, and a solid fill at this size ends up
  // competing with the card's title.
  alert: "text-red-800 font-semibold bg-danger/10",
  // Condition of a copy (see statusTone in config/statusTypes): how good it is
  // at a glance. Tinted, same as alert, and the text stays next to the color.
  good: "text-green-800 font-medium bg-green-100",
  used: "text-orange-800 font-medium bg-orange-100",
  none: "text-gray-600 font-medium bg-gray-200",
  want: "text-[#0a7a4d] font-semibold bg-want/10",
  done: "text-ink font-semibold bg-surface-strong",
  // Same hue as the "en disputa" status badge: purple is reserved for team
  // intervention. Tinted, not solid — this marks a role, not an irreversible
  // state. Contrast is tuned for the dark sidebar surface.
  admin: "text-purple-300 bg-purple-600/20",
};

const Chip = ({
  children = null,
  tooltip = "",
  className = "",
  tone = "neutral",
  placement = "",
}: {
  children?: ReactNode;
  tooltip?: string;
  className?: string;
  tone?: keyof typeof TONES;
  placement?: "top" | "bottom" | "left" | "right" | "";
}) => {
  // Tooltip attribute lives on this wrapper, not on the truncated pill.
  // Tailwind `truncate` is overflow:hidden — keeping data-tooltip off that
  // node avoids clipping the trigger; the bubble itself is portaled.
  return (
    <div
      className={clsx(
        "inline-flex max-w-full min-w-0",
        tooltip ? "cursor-help" : null
      )}
      data-tooltip={tooltip || undefined}
      data-placement={placement || undefined}
    >
      <span
        className={clsx(
          "text-caption px-2 py-0.5 rounded-md text-nowrap truncate max-w-full",
          TONES[tone] || TONES.neutral,
          className
        )}
      >
        {children}
      </span>
    </div>
  );
};

export default Chip;
