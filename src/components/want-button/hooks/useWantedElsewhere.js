import { useContext, useMemo } from "react";
import { PageContext } from "@/context/page";
import { ItemContext } from "@/context/item";
import { GameContext } from "@/context/game";

// Before adding a want, whether part of it is already wanted in another want
// (each want is fulfilled on its own, so that could mean receiving it twice).
// Returns "item" when wanting a copy that's already in a game/tag want, "game"
// when wanting a game that has copies already wanted on their own or in a
// tag, or null.
const useWantedElsewhere = () => {
  const { myWants } = useContext(PageContext);
  const { item, otherWantGroups } = useContext(ItemContext);
  const { game } = useContext(GameContext);

  return useMemo(() => {
    if (item?.id) {
      return otherWantGroups?.length ? "item" : null;
    }
    if (!game?.items?.length || !myWants?.length) return null;
    const copyIds = new Set(game.items.map(({ id }) => `${id}`));
    const copyWanted = myWants.some(
      (w) =>
        w.type !== "game" &&
        (w.wants || []).some(({ id }) => copyIds.has(`${id}`))
    );
    return copyWanted ? "game" : null;
  }, [item, otherWantGroups, game, myWants]);
};

export default useWantedElsewhere;
