import { getI18Ntext } from "@/i18n";

const HOUR_MS = 1000 * 60 * 60;
const DAY_MS = HOUR_MS * 24;

export const msLeftUntil = (isoDate: string) =>
  Math.max(0, new Date(isoDate).getTime() - Date.now());

// Matches the home countdown: whole days (rounded down) while a day or more
// is left, hours under a day. Rounding days up said "1 día" with 2 hours left.
export const timeLeftLabel = (msLeft: number) => {
  if (msLeft <= 0) return getI18Ntext("menu.stage.today");
  if (msLeft < DAY_MS) {
    const hours = Math.ceil(msLeft / HOUR_MS);
    return hours === 1
      ? getI18Ntext("menu.stage.1hour")
      : getI18Ntext("menu.stage.hours", [hours]);
  }
  const days = Math.floor(msLeft / DAY_MS);
  return days === 1
    ? getI18Ntext("menu.stage.1day")
    : getI18Ntext("menu.stage.days", [days]);
};
