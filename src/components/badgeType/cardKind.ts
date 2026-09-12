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

// Left-border accent + a faint background tint of the same color, one pair
// per content category — the border alone (matching docs/design-system.html's
// literal .game-card.is-base/.is-expansion CSS) read as too subtle once built:
// a page full of white cards only differed by a thin 4px edge. The tint makes
// each category recognizable at a glance while scrolling, which was the
// original ask this color system was built for.
const CARD_KIND_CLASSES: Record<CardKind, string> = {
  base: "border-l-4 border-l-gameBase bg-gameBase/5",
  expansion: "border-l-4 border-l-gameExpansion bg-gameExpansion/5",
  combo: "border-l-4 border-l-gameCombo bg-gameCombo/5",
  other: "border-l-4 border-l-yellow-600 bg-yellow-600/5",
};

export const cardKindBorderClass = (kind: CardKind) => CARD_KIND_CLASSES[kind];
