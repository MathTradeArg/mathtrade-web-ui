import clsx from "clsx";

export const FlowArrow = ({ tone = "want" }: { tone?: "want" | "give" }) => {
  return (
    <div
      className={clsx(
        "self-center shrink-0 text-lg font-bold leading-none px-0.5 sm:px-1",
        tone === "want" ? "text-want" : "text-secondary"
      )}
      aria-hidden
    >
      →
    </div>
  );
};

const TradeArrows = ({ padded = true }: { padded?: boolean }) => {
  return (
    <div
      className={clsx(
        "w-7 shrink-0 text-center text-base font-bold leading-[1.15] px-0.5 sm:px-0",
        padded ? "pt-10 sm:pt-[72px]" : "self-center"
      )}
      aria-hidden
    >
      <div className="text-secondary">→</div>
      <div className="text-want">←</div>
    </div>
  );
};

export default TradeArrows;
