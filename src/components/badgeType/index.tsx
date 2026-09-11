import clsx from "clsx";
import I18N, { getI18Ntext } from "@/i18n";
import Icon from "@/components/icon";

type BadgeTypeProps = {
  type: "game" | "item" | "tag";
  subtype?: number;
  isCombo?: boolean;
  dark?: boolean;
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
  className,
}: BadgeTypeProps) => {
  const isGameOrItem = type === "game" || type === "item";
  const isBase = isGameOrItem && subtype === 1 && !isCombo;
  const isExpansion = isGameOrItem && subtype === 2 && !isCombo;
  const isComboBadge = isGameOrItem && isCombo;

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-1 uppercase leading-[1.7] px-2 font-bold rounded-[3px]",
        {
          "bg-gameBase/10 text-gameBase": isBase && !dark,
          "bg-white/15 text-gray-100": isBase && dark,
          "bg-gameExpansion/10 text-gameExpansion": isExpansion && !dark,
          "bg-gameExpansion/20 text-orange-300": isExpansion && dark,
          "bg-gameCombo/10 text-gameCombo": isComboBadge && !dark,
          "bg-gameCombo/25 text-violet-300": isComboBadge && dark,
          "bg-yellow-300 text-black border border-yellow-600": subtype === 3,
          "bg-gray-300 text-gray-900 border border-gray-500": type === "tag",
        },
        className
      )}
    >
      {isBase ? <Icon type="square" className="shrink-0" /> : null}
      {isExpansion ? <Icon type="plus" className="shrink-0" /> : null}
      {isComboBadge ? <Icon type="combo" className="shrink-0" /> : null}
      {isComboBadge ? (
        getI18Ntext("element-type-badge-0")
      ) : (
        <I18N id={`cart.wantGroup.type.${type}.${subtype || 1}`} />
      )}
    </div>
  );
};

export default BadgeType;
