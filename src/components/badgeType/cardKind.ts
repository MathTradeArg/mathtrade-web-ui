export type CardKind = "base" | "expansion" | "combo" | "other";

export const resolveCardKind = ({
  isCombo,
  isTrueNotGame,
  isExpansion,
}: {
  isCombo: boolean;
  isTrueNotGame: boolean;
  isExpansion: boolean;
}): CardKind => {
  if (isCombo) return "combo";
  if (isTrueNotGame) return "other";
  if (isExpansion) return "expansion";
  return "base";
};

// Left-border accent, one color per content category. "base" swaps to a
// neutral gray on dark cards (game-grid's hero card) since gameBase
// (#1C1F26, near-black) is invisible against bg-gray-900 there — same
// adaptation already applied to BadgeType's `dark` variant.
const LEFT_BORDER: Record<"light" | "dark", Record<CardKind, string>> = {
  light: {
    base: "border-l-4 border-l-gameBase",
    expansion: "border-l-4 border-l-gameExpansion",
    combo: "border-l-4 border-l-gameCombo",
    other: "border-l-4 border-l-yellow-600",
  },
  dark: {
    base: "border-l-4 border-l-gray-600",
    expansion: "border-l-4 border-l-gameExpansion",
    combo: "border-l-4 border-l-gameCombo",
    other: "border-l-4 border-l-yellow-600",
  },
};

export const cardKindBorderClass = (
  kind: CardKind,
  variant: "light" | "dark" = "light"
) => LEFT_BORDER[variant][kind];
