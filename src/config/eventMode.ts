// Event mode (backend EVENT_MODE, read from `current/`): a participant only
// reaches Home, Results, Results history and My reports. Pure module (no `@/`
// imports) so `node --test` can run its test.
import { PRIVATE_ROUTES } from "./routes.ts";

export const EVENT_OPEN_KEYS = ["HOME", "RESULTS", "RESULTS_HISTORIAL", "MY_REPORTS"] as const;
export const EVENT_LOCK_CAPTION = "menu.locked.eventMode";

export type EventLock = { daysLeft: number; captionId: string; displayValue?: string | number };

const normalize = (pathname: string) => {
  const lower = pathname.toLowerCase();
  return lower.length > 1 && lower.endsWith("/") ? lower.replace(/\/+$/, "") : lower;
};

const HOME_PATH = normalize(PRIVATE_ROUTES.HOME.path);
const OPEN_SECTION_PATHS = EVENT_OPEN_KEYS.filter((key) => key !== "HOME").map((key) =>
  normalize(PRIVATE_ROUTES[key].path)
);

/** Home exactly; the open sections and their subroutes ("results" doesn't match "results-historial"). */
export const isEventOpenPath = (pathname: string | null): boolean => {
  if (!pathname) return false;
  const path = normalize(pathname);
  if (path === HOME_PATH) return true;
  return OPEN_SECTION_PATHS.some((open) => path === open || path.startsWith(open + "/"));
};

const isOpenKey = (key: string) => (EVENT_OPEN_KEYS as readonly string[]).includes(key);

/**
 * `base` = the date/membership locks. Open keys keep whatever they had (a date
 * lock is respected); every other key gets the event-mode lock.
 */
export const withEventLocks = (
  keys: string[],
  base: Record<string, EventLock>
): Record<string, EventLock> => {
  const locks: Record<string, EventLock> = { ...base };
  keys.forEach((key) => {
    if (!isOpenKey(key)) {
      locks[key] = { daysLeft: 0, captionId: EVENT_LOCK_CAPTION };
    }
  });
  return locks;
};

export type RouteGate = "allow" | "loading" | "blocked";

/**
 * Admins and the flag off: allow. Flag unknown (current/ not loaded yet):
 * open routes allow, closed ones wait. Flag on: closed routes are blocked.
 */
export const routeGate = ({
  eventMode,
  isAdmin,
  pathname,
}: {
  eventMode: boolean | null;
  isAdmin: boolean;
  pathname: string | null;
}): RouteGate => {
  if (isAdmin || eventMode === false) return "allow";
  if (isEventOpenPath(pathname)) return "allow";
  return eventMode === null ? "loading" : "blocked";
};
