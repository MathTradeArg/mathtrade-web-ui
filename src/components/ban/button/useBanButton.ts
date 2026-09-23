import { useCallback, useContext, useMemo } from "react";
import { ItemContext } from "@/context/item";
import { GameContext } from "@/context/game";
import { PageContext } from "@/context/page";
import { useOptions } from "@/store";
import useFetch from "@/hooks/useFetch";

const useBanButton = (type = "item") => {
  const { forceReloadPage } = useContext(PageContext);
  const updateFilters = useOptions((state) => state.updateFilters);

  const {
    item,
    showAsIgnored: showAsIgnoredItem,
    setShowAsIgnored: setShowAsIgnoredItem,
    setBanId: setBanIdItem,
  } = useContext(ItemContext);
  const {
    game,
    showAsIgnored: showAsIgnoredGame,
    setShowAsIgnored: setShowAsIgnoredGame,
    setBanId: setBanIdGame,
  } = useContext(GameContext);

  const ban_id = useMemo(() => {
    if (type === "item") return item?.ban_id || null;
    return game?.ban_id || null;
  }, [item, game, type]);

  const afterLoadBan = useCallback(
    (res) => {
      if (type === "item") {
        if (res?.id) setBanIdItem(res.id);
        setShowAsIgnoredItem(true);
      }
      if (type === "game") {
        if (res?.id) setBanIdGame(res.id);
        setShowAsIgnoredGame(true);
      }
      // Forces the list to refetch, the same way switching a filter chip
      // does (updateFilters always returns a new object reference) —
      // otherwise the ignored-filter views only reflect this ban after an
      // unrelated filter change.
      updateFilters({}, type);
      forceReloadPage();
    },
    [
      type,
      setBanIdItem,
      setBanIdGame,
      setShowAsIgnoredItem,
      setShowAsIgnoredGame,
      updateFilters,
      forceReloadPage,
    ]
  );

  const afterLoadUnban = useCallback(() => {
    if (type === "item") {
      setBanIdItem(null);
      setShowAsIgnoredItem(false);
    }
    if (type === "game") {
      setBanIdGame(null);
      setShowAsIgnoredGame(false);
    }
    updateFilters({}, type);
    forceReloadPage();
  }, [
    type,
    setBanIdItem,
    setBanIdGame,
    setShowAsIgnoredItem,
    setShowAsIgnoredGame,
    updateFilters,
    forceReloadPage,
  ]);

  const [banElement, , loadingBanElement] = useFetch({
    endpoint: "POST_BAN",
    method: "POST",
    afterLoad: afterLoadBan,
  });

  const [unbanElement, , loadingUnBanElement] = useFetch({
    endpoint: type === "item" ? "DELETE_BAN_ITEM" : "DELETE_BAN_GAME",
    method: "DELETE",
    afterLoad: afterLoadUnban,
  });

  const onClick = useCallback(
    (e) => {
      e.preventDefault();

      if (ban_id) {
        unbanElement({ urlParams: [ban_id] });
        return;
      }

      if (type === "item") {
        banElement({ params: { type: "I", identity: item?.id } });
      }
      if (type === "game") {
        banElement({ params: { type: "G", identity: game?.bgg_id } });
      }
    },
    [item, game, type, banElement, unbanElement, ban_id]
  );

  return {
    showAsIgnored: showAsIgnoredItem || showAsIgnoredGame,
    onClick,
    loading: loadingBanElement || loadingUnBanElement,
    ban_id,
  };
};

export default useBanButton;
