import clsx from "clsx";

const TONES: Record<string, string> = {
  neutral: "text-gray-500 bg-colorMain",
  // For a value that asks the user to do something rather than describing the
  // copy. Tinted instead of solid: these chips sit inside cards that already
  // carry a background tint of their own, and a solid fill at this size ends up
  // competing with the card's title.
  alert: "text-red-800 font-bold bg-danger/10",
};

const Chip = ({
  children = null,
  tooltip = "",
  className = "",
  tone = "neutral",
}) => {
  // Tooltip lives on this wrapper, not on the truncated pill. Tailwind
  // `truncate` is overflow:hidden — the ::before bubble animates from inside
  // the chip and then sits above it, so the same node clipped the tooltip
  // the instant it left the pill (a one-frame flash).
  return (
    <div
      className="inline-flex max-w-full min-w-0"
      data-tooltip={tooltip || undefined}
    >
      <span
        className={clsx(
          "text-caption px-2.5 py-1 rounded-md text-nowrap truncate max-w-full",
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
