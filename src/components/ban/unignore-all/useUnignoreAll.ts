import { useCallback, useContext } from "react";
import { PageContext } from "@/context/page";
import { SidebarContext } from "@/context/sidebar";
import { useOptions } from "@/store";
import useFetch from "@/hooks/useFetch";

const useUnignoreAll = (type = "game") => {
  const { forceReloadPage } = useContext(PageContext);
  const { hideSidebar } = useContext(SidebarContext);
  const updateFilters = useOptions((state) => state.updateFilters);

  const afterLoad = useCallback(() => {
    updateFilters({ ignored: undefined, page: 1 }, type);
    forceReloadPage();
    hideSidebar?.();
  }, [updateFilters, type, forceReloadPage, hideSidebar]);

  const [unignoreAll, , loading, error] = useFetch({
    endpoint:
      type === "item" ? "DELETE_BANNED_ITEMS_ALL" : "DELETE_BANNED_GAMES_ALL",
    method: "DELETE",
    afterLoad,
  });

  return { unignoreAll, loading, error };
};

export default useUnignoreAll;
