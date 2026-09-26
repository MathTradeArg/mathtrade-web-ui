"use client";
import I18N, { getI18Ntext } from "@/i18n";
import Thumbnail from "@/components/thumbnail";
import clsx from "clsx";
import { cardKindBorderClass, resolveItemKind } from "@/components/badgeType/cardKind";
import type { ProvisionalSummaryRow } from "./useProvisionalResults";

// Titles come from other members' items and the sentence is rendered as
// HTML (for the bold parts): escape them.
const escapeHtml = (text: string) =>
  text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

// "1 vez X" / "3 veces X" / "1 vez no lo cambiaste…" / "2 veces no lo…":
// the singular strings have no count placeholder.
const times = (count: number, what: string, noTrade = false) => {
  const one = count === 1;
  const id = `provisional.summary.${noTrade ? "noTrade" : "times"}.${
    one ? "one" : "many"
  }`;
  const values = noTrade ? (one ? [] : [count]) : one ? [what] : [count, what];
  return getI18Ntext(id, values);
};

// "a, b y c"
const joinSpanish = (parts: string[]) =>
  parts.length <= 1
    ? parts.join("")
    : `${parts.slice(0, -1).join(", ")} ${getI18Ntext(
        "provisional.summary.and"
      )} ${parts[parts.length - 1]}`;

// Per item: "Por tu X: en 5 corridas te salió 3 veces A, 1 vez B y 1 vez no
// lo cambiaste por nada". The runs themselves are never shown apart.
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
      title: escapeHtml(outcome.received.title || ""),
      count: 0,
    };
    prev.count += 1;
    counts.set(key, prev);
  });

  const received = Array.from(counts.values())
    .sort((a, b) => b.count - a.count)
    .map(({ count, title: what }) => times(count, what));
  const sentence = received.length
    ? getI18Ntext("provisional.summary.sentence", [
        outcomes.length,
        joinSpanish(noTrade ? [...received, times(noTrade, "", true)] : received),
      ])
    : getI18Ntext("provisional.summary.never", [outcomes.length]);

  // One card per offered item; all cards share the grid row height, so short
  // sentences don't make a card smaller than the rest.
  return (
    <article
      className={clsx(
        "h-full flex flex-col bg-white rounded-xl shadow-lg overflow-hidden",
        cardKindBorderClass(resolveItemKind(item))
      )}
    >
      <div className="relative h-40 bg-gray-100 shrink-0">
        <Thumbnail
          fill
          contain
          elements={[{ thumbnail: first?.thumbnail || "" }]}
          className="w-full h-full"
        />
      </div>
      <div className="flex-1 flex flex-col gap-2 p-4">
        <h3
          className="font-bold text-base leading-snug line-clamp-2 min-h-[2.75rem]"
          title={item?.title || ""}
        >
          {item?.title}
        </h3>
        <p
          className="text-sm text-gray-700"
          dangerouslySetInnerHTML={{ __html: sentence }}
        />
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
      <div className="grid gap-6 auto-rows-fr [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
        {rows.map((row) => (
          <SummaryRow key={row.item.id} row={row} />
        ))}
      </div>
    </section>
  );
};

export default ProvisionalSummary;
