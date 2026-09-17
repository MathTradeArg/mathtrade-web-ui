import clsx from "clsx";
import I18N, { getI18Ntext } from "@/i18n";
import Icon from "@/components/icon";

type BadgeTypeProps = {
  type: "game" | "item" | "tag";
  subtype?: number;
  isCombo?: boolean;
  dark?: boolean;
  size?: "default" | "compact";
  className?: string;
};

// Three content categories, each with its own color + icon everywhere
// (game-grid vs. item context used to diverge here): base game, expansion,
// combo (a bundle of several elements — takes priority over base/expansion
// since a combo card is never "just" a base game or expansion visually).
// `dark` swaps the base-game tint for one legible on a dark card
// (near-black gameBase text is invisible on game-grid's dark hero card).
const BadgeType = ({
  type,
  subtype = 1,
  isCombo,
  dark,
  size = "default",
  className,
}: BadgeTypeProps) => {
  const isGameOrItem = type === "game" || type === "item";
  const isBase = isGameOrItem && subtype === 1 && !isCombo;
  const isExpansion = isGameOrItem && subtype === 2 && !isCombo;
  const isComboBadge = isGameOrItem && isCombo;

  return (
    <div
      className={clsx(
        // text-heading (19px) sits next to the card title on purpose on
        // the offer/collection grid. Mini surfaces (Mis deseos, BGG hits)
        // pass size="compact" — className="text-[9px]" used to lose to
        // text-heading in the compiled CSS, which is why the want cards
        // showed a title-sized JUEGO chip.
        "inline-flex items-center uppercase leading-none font-bold rounded-[3px] min-w-0",
        size === "compact"
          ? "gap-1 px-1.5 py-[2px] text-[9px] tracking-wide"
          : "gap-1.5 px-2.5 py-1 text-heading",
        {
          // Filled pills, not 10% tints: the card already carries a tint of
          // the same hue, so a faint badge disappeared into it. Solid fill
          // is the second signal (after the 6px left edge) that you can
          // read from across the grid.
          "bg-gameBase text-white": isBase && !dark,
          "bg-white/15 text-gray-100": isBase && dark,
          "bg-gameExpansion text-white": isExpansion && !dark,
          "bg-gameExpansion/20 text-sky-300": isExpansion && dark,
          "bg-gameCombo text-white": isComboBadge && !dark,
          "bg-gameCombo/25 text-violet-300": isComboBadge && dark,
          "bg-gameOther text-white": subtype === 3 && !isComboBadge,
          "bg-gray-300 text-gray-900 border border-gray-500": type === "tag",
        },
        className
      )}
    >
      {isBase ? <Icon type="square" className="shrink-0" /> : null}
      {isExpansion ? <Icon type="plus" className="shrink-0" /> : null}
      {isComboBadge ? <Icon type="combo" className="shrink-0" /> : null}
      {subtype === 3 && !isComboBadge ? (
        <Icon type="other" className="shrink-0" />
      ) : null}
      {isComboBadge ? (
        getI18Ntext("element-type-badge-0")
      ) : (
        <I18N id={`cart.wantGroup.type.${type}.${subtype || 1}`} />
      )}
    </div>
  );
};

export default BadgeType;
