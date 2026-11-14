const BA = "America/Argentina/Buenos_Aires";
const fmt = new Intl.DateTimeFormat("es-AR", {
  timeZone: BA,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// Report timestamps always shown in Buenos Aires time: "13/11/2026 12:05".
export const formatReportDate = (iso?: string | null): string => {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const p = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, x.value]));
  return `${p.day}/${p.month}/${p.year} ${p.hour}:${p.minute}`;
};
