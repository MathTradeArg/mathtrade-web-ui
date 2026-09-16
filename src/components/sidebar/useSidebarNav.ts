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

  // Only WANTS has a real, page-enforced stage gate today (my-wants/page.jsx
  // blocks its whole body while canI.offer is true). Keying this off the
  // same canI flag the page already checks keeps the nav hint and the page
  // gate from ever disagreeing.
  const lockedInfo: Record<string, { daysLeft: number }> = useMemo(() => {
    if (!canI.offer || !mathtrade?.freeze_geek_date) {
      return {};
    }
    const daysLeft = Math.max(
      0,
      Math.ceil(
        (new Date(mathtrade.freeze_geek_date).getTime() - Date.now()) /
          (1000 * 60 * 60 * 24)
      )
    );
    return { WANTS: { daysLeft } };
  }, [canI.offer, mathtrade?.freeze_geek_date]);

  const isActive = (path: string) =>
    pathname === path || Boolean(pathname && pathname.startsWith(path + "/"));

  return { items, isActive, collapsed, toggleCollapsed, lockedInfo };
};

export default useSidebarNav;
