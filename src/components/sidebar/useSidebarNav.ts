import { useContext, useMemo } from "react";
import { usePathname } from "next/navigation";
import { PageContext } from "@/context/page";
import { useStore, useOptions } from "@/store";
import { PRIMARY_NAV, SIGN_TO_MATHTRADE_ENTRY, type NavEntry } from "@/config/nav";

const COLLAPSE_KEY = "sidebar_mainNav_collapsed";
// Always-visible subset when there's no active mathtrade or no membership yet (mirrors MenuListDefault).
const DEFAULT_KEYS = ["MY_COLLECTION", "STATS"];

const useSidebarNav = () => {
  const { canI } = useContext(PageContext);
  const { membership, mathtrade } = useStore((state) => state.data);
  const pathname = usePathname();

  const options = useOptions((state) => state.options);
  const updateOptions = useOptions((state) => state.updateOptions);
  const collapsed = Boolean(options[COLLAPSE_KEY]);
  const toggleCollapsed = () => updateOptions({ [COLLAPSE_KEY]: !collapsed });

  const items: NavEntry[] = useMemo(() => {
    if (mathtrade && membership) {
      return PRIMARY_NAV;
    }
    const base = PRIMARY_NAV.filter((entry) => DEFAULT_KEYS.includes(entry.key));
    if (mathtrade && !membership && canI.sign) {
      return [...base, SIGN_TO_MATHTRADE_ENTRY];
    }
    return base;
  }, [mathtrade, membership, canI]);

  const isActive = (path: string) =>
    pathname === path || Boolean(pathname && pathname.startsWith(path + "/"));

  return { items, isActive, collapsed, toggleCollapsed };
};

export default useSidebarNav;
