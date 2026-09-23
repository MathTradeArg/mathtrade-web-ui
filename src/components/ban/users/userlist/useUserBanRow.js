import { useCallback, useMemo, useContext } from "react";
import useFetch from "@/hooks/useFetch";
import { PageContext } from "@/context/page";
import { useOptions } from "@/store";

const useUserBanRow = (user, userBans, setUserBans) => {
  const { forceReloadPage } = useContext(PageContext);
  const updateFilters = useOptions((state) => state.updateFilters);

  /* POST BAN  **********************************************/
  const afterLoadBan = useCallback(
    (res) => {
      const { id, identity } = res;
      setUserBans((oldUserBans) => {
        const oldUserBansCopy = { ...oldUserBans };
        oldUserBansCopy[identity] = id;
        return oldUserBansCopy;
      });
      // Banning a user hides all their items/games from the offer lists.
      // Force both lists to refetch so the change is reflected immediately
      // without requiring a manual filter interaction (same pattern as
      // useBanButton.ts — updateFilters creates a new filter reference so
      // the useFetch dependency array sees a change even if the filter
      // values haven't changed).
      updateFilters({}, "item");
      updateFilters({}, "game");
      forceReloadPage();
    },
    [setUserBans, updateFilters, forceReloadPage]
  );

  const [banUser, , loadingBan] = useFetch({
    endpoint: "POST_BAN",
    method: "POST",
    afterLoad: afterLoadBan,
  });
  /* end POST BAN  **********************************************/

  /* DELETE (UNBAN)  **********************************************/
  const afterLoadUnBan = useCallback(() => {
    const { id } = user;
    setUserBans((oldUserBans) => {
      const oldUserBansCopy = { ...oldUserBans };
      delete oldUserBansCopy[id];
      return oldUserBansCopy;
    });
    updateFilters({}, "item");
    updateFilters({}, "game");
    forceReloadPage();
  }, [user, setUserBans, updateFilters, forceReloadPage]);

  const [unbanUser, , loadingUnBan] = useFetch({
    endpoint: "DELETE_BAN_USER",
    method: "DELETE",
    afterLoad: afterLoadUnBan,
  });
  /* end DELETE (UNBAN)  **********************************************/

  const ban_id = useMemo(() => {
    return userBans[user.id] || null;
  }, [user, userBans]);

  const onClick = useCallback(() => {
    if (ban_id) {
      unbanUser({ urlParams: [ban_id] });
    } else {
      const params = { type: "U", identity: user?.id };
      banUser({ params });
    }
  }, [user, ban_id, banUser, unbanUser]);

  return {
    ban_id,
    onClick,
    loading: loadingBan || loadingUnBan,
  };
};

export default useUserBanRow;
