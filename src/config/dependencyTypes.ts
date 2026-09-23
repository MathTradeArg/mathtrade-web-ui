import { getI18Ntext } from "@/i18n";

export const dependencyLabel = (raw: string | number) => {
  const n = parseInt(`${raw}`, 10);
  if (Number.isNaN(n)) return `${raw}`;
  const index = n >= 1 && n <= 5 ? n - 1 : Math.min(Math.max(n, 0), 4);
  return getI18Ntext(`dependencyType.min.${index}`);
};

export const normalizeDependencyValue = (raw: string | number) => {
  const n = Number(raw);
  if (!Number.isFinite(n)) return String(raw);
  return String(Math.round(n));
};

export const dependencyOptions = [1, 2, 3, 4, 5].map((value) => ({
  value: String(value),
  text: dependencyLabel(value),
}));

export const dependencyChipsFromCounts = (
  counts: Record<string, number> | undefined
) => {
  if (!counts || typeof counts !== "object") return null;
  const merged: Record<string, { value: string; text: string; count: number }> =
    {};
  let noDataCount = 0;
  Object.entries(counts).forEach(([rawKey, num]) => {
    const count = Number(num) || 0;
    if (!count) return;
    if (rawKey === "null" || rawKey === "None") {
      noDataCount += count;
      return;
    }
    const value = normalizeDependencyValue(rawKey);
    const n = parseInt(value, 10);
    if (!Number.isFinite(n) || n < 1 || n > 5) return;
    if (!merged[value]) {
      merged[value] = { value, text: dependencyLabel(value), count: 0 };
    }
    merged[value].count += count;
  });
  const list = Object.values(merged).sort(
    (a, b) => Number(a.value) - Number(b.value)
  );
  if (noDataCount) {
    list.push({
      value: "none",
      text: getI18Ntext("dependencyType.noData"),
      count: noDataCount,
    });
  }
  return list.length ? list : null;
};
