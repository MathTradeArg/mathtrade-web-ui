import { useContext, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PageContext } from "@/context/page";
import { useStore, useOptions } from "@/store";
import {
  HOME_ENTRY,
  PRIMARY_NAV,
  SIGN_TO_MATHTRADE_ENTRY,
  type NavEntry,
} from "@/config/nav";
import { PRIVATE_ROUTES } from "@/config/routes";

const COLLAPSE_KEY = "sidebar_mainNav_collapsed";
const DEFAULT_KEYS = ["MY_COLLECTION", "STATS"];

export type LockedInfo = { daysLeft: number; captionId: string };

export type NavGroup = {
  id: string;
  labelI18nKey: string;
  items: NavEntry[];
};

const EVENT_ORDER = [
  "OFFER",
  "MY_OFFER",
  "WANTS",
  "PROVISIONAL_RESULTS",
  "RESULTS",
  "SIGN_TO_MATHTRADE",
];
const SPACE_ORDER = ["MY_COLLECTION", "STATS", "RESULTS_HISTORIAL", "MY_DATA"];

const sortBy = (order: string[]) => (a: NavEntry, b: NavEntry) =>
  order.indexOf(a.key) - order.indexOf(b.key);

const daysLeftUntil = (isoDate) =>
  Math.max(
    0,
    Math.ceil((new Date(isoDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );

const captionIdFor = (
  stage: "wants" | "results" | "provisional",
  daysLeft: number
) => {
  const base = `menu.locked.${stage}`;
  if (daysLeft <= 0) return `${base}.today`;
  if (daysLeft === 1) return `${base}.1day`;
  return `${base}.days`;
};

const useSidebarNav = () => {
  const { canI } = useContext(PageContext);
  const { membership, mathtrade, mathtrade_history } = useStore(
    (state) => state.data
  );
  const pathname = usePathname();

  const options = useOptions((state) => state.options);
  const updateOptions = useOptions((state) => state.updateOptions);
  const collapsed = Boolean(options[COLLAPSE_KEY]);
  const toggleCollapsed = () => updateOptions({ [COLLAPSE_KEY]: !collapsed });

  const items: NavEntry[] = useMemo(() => {
    const withHome = (list: NavEntry[]) => [HOME_ENTRY, ...list];
    if (mathtrade && membership) {
      return withHome(PRIMARY_NAV);
    }
    const visibleKeys =
      mathtrade_history?.length > 0
        ? [...DEFAULT_KEYS, "RESULTS_HISTORIAL"]
        : DEFAULT_KEYS;
    const base = PRIMARY_NAV.filter((entry) => visibleKeys.includes(entry.key));
    if (mathtrade && !membership && canI.sign) {
      return withHome([...base, SIGN_TO_MATHTRADE_ENTRY]);
    }
    return withHome(base);
  }, [mathtrade, membership, canI, mathtrade_history]);

  const lockedInfo: Record<string, LockedInfo> = useMemo(() => {
    const locked: Record<string, LockedInfo> = {};
    if (canI.offer && mathtrade?.freeze_geek_date) {
      const daysLeft = daysLeftUntil(mathtrade.freeze_geek_date);
      locked.WANTS = {
        daysLeft,
        captionId: captionIdFor("wants", daysLeft),
      };
    }
    if (
      !canI.provisionalResults &&
      mathtrade?.provisional_results_date
    ) {
      const daysLeft = daysLeftUntil(mathtrade.provisional_results_date);
      locked.PROVISIONAL_RESULTS = {
        daysLeft,
        captionId: captionIdFor("provisional", daysLeft),
      };
    }
    if (!canI.results) {
      const unlockDate = [mathtrade?.show_results_date, mathtrade?.freeze_wants_date]
        .filter(Boolean)
        .sort(
          (a, b) => new Date(b as string).getTime() - new Date(a as string).getTime()
        )[0];
      if (unlockDate) {
        const daysLeft = daysLeftUntil(unlockDate);
        locked.RESULTS = {
          daysLeft,
          captionId: captionIdFor("results", daysLeft),
        };
      }
    }
    return locked;
  }, [
    canI.offer,
    canI.provisionalResults,
    canI.results,
    mathtrade?.freeze_geek_date,
    mathtrade?.freeze_wants_date,
    mathtrade?.provisional_results_date,
    mathtrade?.show_results_date,
  ]);

  const groups: NavGroup[] = useMemo(() => {
    const eventItems = items
      .filter((entry) => EVENT_ORDER.includes(entry.key))
      .sort(sortBy(EVENT_ORDER));
    const spaceItems = items
      .filter((entry) => SPACE_ORDER.includes(entry.key))
      .sort(sortBy(SPACE_ORDER));
    const next: NavGroup[] = [];
    if (eventItems.length) {
      next.push({
        id: "event",
        labelI18nKey: "menu.group.event",
        items: eventItems,
      });
    }
    if (spaceItems.length) {
      next.push({
        id: "space",
        labelI18nKey: "menu.group.space",
        items: spaceItems,
      });
    }
    return next;
  }, [items]);

  const isActive = (path: string) => {
    if (path === PRIVATE_ROUTES.HOME.path) {
      return pathname === path;
    }
    return pathname === path || Boolean(pathname && pathname.startsWith(path + "/"));
  };

  const provisionalWindowActive = Boolean(
    canI.provisionalResults && !canI.results
  );

  return {
    items,
    groups,
    isActive,
    collapsed,
    toggleCollapsed,
    lockedInfo,
    provisionalWindowActive,
  };
};

export const useRedirectIfNavLocked = (key: string) => {
  const { lockedInfo } = useSidebarNav();
  const router = useRouter();
  const locked = Boolean(lockedInfo[key]);

  useEffect(() => {
    if (locked) {
      router.replace(PRIVATE_ROUTES.HOME.path);
    }
  }, [locked, router]);

  return locked;
};

export default useSidebarNav;
