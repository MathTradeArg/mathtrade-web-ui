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

// Game catalog cards never use "combo". The backend buckets a bundled
// item (several games as one offer) as a no-BGG-match placeholder; in
// the Juegos grid that still means "fuera de la BGG". Combo is reserved
// for ejemplar cards, where the bundle is the unit being offered.
export const resolveGameKind = ({
  notGame = false,
  typeNum = 1,
}: {
  notGame?: boolean;
  typeNum?: number;
}): CardKind =>
  resolveCardKind({
    isCombo: false,
    isTrueNotGame: !!notGame,
    isExpansion: !notGame && typeNum === 2,
  });

// The card is filled with the color of its content category (no side
// border): cream base, pastel blue expansion, lilac combo, mint "fuera de
// la BGG". Only the cream card carries a visible warm border; the colored
// ones carry a transparent border of the same width so every card
// measures the same. The solid game* tokens stay for the category badges.
const CARD_KIND_FILL: Record<CardKind, string> = {
  base: "bg-surface border border-line",
  expansion: "bg-sky border border-transparent",
  combo: "bg-lilac border border-transparent",
  other: "bg-mint border border-transparent",
};

export const cardKindFillClass = (kind: CardKind) => CARD_KIND_FILL[kind];

export const cardKindClass = (kind: CardKind) =>
  `rounded-card ${CARD_KIND_FILL[kind]}`;

/* Bounds every card chrome: content wraps/clips inside the white card box,
 * not the page/viewport. Apply on the element that paints the card surface
 * (wrapper, offer-grid shell, my-offer article, previewer shell, …). */
export const cardSurfaceClass =
  "min-w-0 max-w-full w-full overflow-x-clip";

type WantGroupLike = {
  type?: string;
  game_type?: number;
  wants?: { elements?: { element?: { game?: { type?: number } } }[] }[];
};

export const resolveWantGroupKind = (wantGroup: WantGroupLike): CardKind => {
  const type = wantGroup?.type;
  const isCombo =
    type === "item" && (wantGroup?.wants?.[0]?.elements?.length || 0) > 1;
  const typeNum =
    type === "game"
      ? wantGroup?.game_type || 1
      : wantGroup?.wants?.[0]?.elements?.[0]?.element?.game?.type || 1;
  return resolveCardKind({
    isCombo,
    isTrueNotGame: type === "tag" || (!isCombo && typeNum === 3),
    isExpansion: !isCombo && typeNum === 2,
  });
};

type ItemLike = {
  isCombo?: boolean;
  elements?: { element?: { game?: { type?: number } } }[];
};

export const resolveItemKind = (item: ItemLike): CardKind => {
  const isCombo = !!(item?.isCombo || (item?.elements?.length || 0) > 1);
  const typeNum = item?.elements?.[0]?.element?.game?.type || 1;
  return resolveCardKind({
    isCombo,
    isTrueNotGame: !isCombo && typeNum === 3,
    isExpansion: !isCombo && typeNum === 2,
  });
};
