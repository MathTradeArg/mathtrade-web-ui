"use client";
import I18N, { getI18Ntext } from "@/i18n";
import WantMiniCard from "@/components/want-components/mini-card";
import { resolveItemKind } from "@/components/badgeType/cardKind";
import type { ProvisionalSummaryRow } from "./useProvisionalResults";

const timesLabel = (count: number, title: string) =>
  getI18Ntext("provisional.summary.times", [count, title]);

const SummaryRow = ({ row }: { row: ProvisionalSummaryRow }) => {
  const { item, outcomes } = row;
  const first = item?.elements?.[0]?.element;
  const counts = new Map<string, { title: string; count: number }>();
  let noTrade = 0;

  outcomes.forEach((outcome) => {
    if (!outcome.received) {
      noTrade += 1;
      return;
    }
    const key = String(outcome.received.id);
    const prev = counts.get(key) || {
      title: outcome.received.title || "",
      count: 0,
    };
    prev.count += 1;
    counts.set(key, prev);
  });

  const parts = [
    ...Array.from(counts.values()).map((entry) =>
      timesLabel(entry.count, entry.title)
    ),
    noTrade ? timesLabel(noTrade, getI18Ntext("provisional.summary.noTrade")) : null,
  ].filter(Boolean);

  return (
    <div className="flex gap-3 items-start py-3 border-b border-gray-200 last:border-0">
      <WantMiniCard
        title={item?.title || ""}
        elements={[{ thumbnail: first?.thumbnail, name: first?.name || item?.title }]}
        kind={resolveItemKind(item)}
        badgeType="item"
        badgeSubtype={first?.game?.type || 1}
      />
      <div className="min-w-0 pt-1">
        <p className="text-sm font-bold text-gray-800 mb-1">{item?.title}</p>
        <p className="text-sm text-gray-600">
          <I18N id="provisional.summary.runs" values={[outcomes.length]} />
          {parts.length ? `: ${parts.join(", ")}` : null}
        </p>
      </div>
    </div>
  );
};

const ProvisionalSummary = ({ rows = [] }: { rows?: ProvisionalSummaryRow[] }) => {
  if (!rows.length) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-base font-bold mb-2">
        <I18N id="provisional.summary.title" />
      </h2>
      <div className="bg-white">
        {rows.map((row) => (
          <SummaryRow key={row.item.id} row={row} />
        ))}
      </div>
    </section>
  );
};

export default ProvisionalSummary;
