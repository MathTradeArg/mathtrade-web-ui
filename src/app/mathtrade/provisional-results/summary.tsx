"use client";
import clsx from "clsx";
import I18N from "@/i18n";
import Thumbnail from "@/components/thumbnail";
import { cardKindBorderClass, resolveItemKind } from "@/components/badgeType/cardKind";
import type { ProvisionalItem, ProvisionalSummaryRow } from "./useProvisionalResults";

const coverOf = (item?: ProvisionalItem | null) =>
  item?.elements?.[0]?.element?.thumbnail || "";

const TimesChip = ({ count }: { count: number }) => (
  <span className="inline-block rounded-full bg-primary/10 text-primary text-xs font-bold px-2 py-0.5">
    {/* "1 vez" has no placeholder: pass the count only to "$$$ veces". */}
    <I18N
      id={`provisional.tile.times.${count === 1 ? "one" : "many"}`}
      values={count === 1 ? [] : [count]}
    />
  </span>
);

// One result: a game this item got in some of the runs, and how many times.
const ResultTile = ({ item, count }: { item: ProvisionalItem; count: number }) => (
  <div
    className={clsx(
      "flex flex-col rounded-lg border border-gray-200 overflow-hidden bg-white",
      cardKindBorderClass(resolveItemKind(item))
    )}
  >
    <div className="relative h-20 bg-gray-100 shrink-0">
      <Thumbnail
        fill
        contain
        elements={[{ thumbnail: coverOf(item) }]}
        className="w-full h-full"
      />
    </div>
    <div className="flex-1 flex flex-col justify-between gap-1.5 p-2">
      <p
        className="text-xs font-semibold leading-snug line-clamp-2"
        title={item.title || ""}
      >
        {item.title}
      </p>
      <div>
        <TimesChip count={count} />
      </div>
    </div>
  </div>
);

// The runs where the item didn't trade.
const NoTradeTile = ({ count }: { count: number }) => (
  <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-2 text-center min-h-[8.5rem]">
    <p className="text-xs font-semibold text-gray-600">
      <I18N id="provisional.tile.noTrade" />
    </p>
    <TimesChip count={count} />
  </div>
);

// One card per offered game, with a card for each thing it got across the
// runs the member took part in. All cards share the grid row height.
const SummaryCard = ({ row }: { row: ProvisionalSummaryRow }) => {
  const { item, outcomes } = row;
  const counts = new Map<string, { item: ProvisionalItem; count: number }>();
  let noTrade = 0;

  outcomes.forEach((outcome) => {
    if (!outcome.received) {
      noTrade += 1;
      return;
    }
    const key = String(outcome.received.id);
    const prev = counts.get(key) || { item: outcome.received, count: 0 };
    prev.count += 1;
    counts.set(key, prev);
  });
  const received = Array.from(counts.values()).sort((a, b) => b.count - a.count);

  return (
    <article
      className={clsx(
        "h-full flex flex-col bg-white rounded-xl shadow-lg overflow-hidden",
        cardKindBorderClass(resolveItemKind(item))
      )}
    >
      <div className="flex gap-3 p-4 border-b border-gray-200">
        <div className="relative w-20 h-20 shrink-0 rounded-md bg-gray-100 overflow-hidden">
          <Thumbnail
            fill
            contain
            elements={[{ thumbnail: coverOf(item) }]}
            className="w-full h-full"
          />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 font-semibold">
            <I18N id="provisional.card.yours" />
          </p>
          <h3
            className="font-bold text-base leading-snug line-clamp-3"
            title={item?.title || ""}
          >
            {item?.title}
          </h3>
        </div>
      </div>
      <div className="flex-1 p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          <I18N
            id={
              received.length
                ? "provisional.card.got"
                : "provisional.card.never"
            }
            values={[outcomes.length]}
          />
        </p>
        <div className="grid grid-cols-2 gap-2">
          {received.map(({ item: got, count }) => (
            <ResultTile key={got.id} item={got} count={count} />
          ))}
          {noTrade ? <NoTradeTile count={noTrade} /> : null}
        </div>
      </div>
    </article>
  );
};

const ProvisionalSummary = ({ rows = [] }: { rows?: ProvisionalSummaryRow[] }) => {
  if (!rows.length) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-base font-bold mb-3">
        <I18N id="provisional.summary.title" />
      </h2>
      <div className="grid gap-6 auto-rows-fr [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
        {rows.map((row) => (
          <SummaryCard key={row.item.id} row={row} />
        ))}
      </div>
    </section>
  );
};

export default ProvisionalSummary;
