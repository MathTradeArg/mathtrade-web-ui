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

// Left-border accent + a background tint of the same color, one pair per
// content category — the border alone (matching docs/design-system.html's
// literal .game-card.is-base/.is-expansion CSS) read as too subtle once
// built: a page full of white cards only differed by a thin 4px edge.
//
// The tint is a pre-mixed SOLID color, not a Tailwind alpha utility
// (bg-gameExpansion/8) — these cards sit on the page's off-white/gray
// background, not pure white, so a translucent tint blends with whatever
// is actually behind it and comes out muddier/grayer than intended. Each
// value below is the real result of mixing the category's token at 8%
// into #ffffff, computed once so it renders identically regardless of
// what's behind the card:
//   base       #1C1F26 @ 8% -> #ededee
//   expansion  #B45309 @ 8% -> #f9f1eb
//   combo      #5B21B6 @ 8% -> #f2edf9
//   other      #ca8a04 @ 8% -> #fbf6eb
const CARD_KIND_CLASSES: Record<CardKind, string> = {
  base: "border-l-4 border-l-gameBase bg-[#ededee]",
  expansion: "border-l-4 border-l-gameExpansion bg-[#f9f1eb]",
  combo: "border-l-4 border-l-gameCombo bg-[#f2edf9]",
  other: "border-l-4 border-l-yellow-600 bg-[#fbf6eb]",
};

export const cardKindBorderClass = (kind: CardKind) => CARD_KIND_CLASSES[kind];
