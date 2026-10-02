import { formatDateString } from "@/utils/dateUtils";

// Receipts are accepted until loading ends (backend contribution_window_open):
// "03/10 a las 23:59", or "" when the edition has no end of loading.
export const contributionDeadline = (mathtrade) => {
  if (!mathtrade?.freeze_geek_date) return "";
  const { dateObj, hour } = formatDateString(mathtrade.freeze_geek_date);
  return `${dateObj.day}/${dateObj.month} a las ${hour}`;
};
